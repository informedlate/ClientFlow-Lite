import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a specific questionnaire template with its questions
export async function GET(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    try {
          const template = await prisma.questionnaireTemplate.findUnique({
                  where: { id: params.id },
                  include: {
                            questions: {
                                        orderBy: { order: 'asc' },
                            },
                  },
          });

      if (!template) {
              return NextResponse.json(
                { error: 'Questionnaire template not found' },
                { status: 404 }
                      );
      }

      return NextResponse.json(template);
    } catch (error) {
          console.error('GET /api/questionnaires/[id]:', error);
          return NextResponse.json(
            { error: 'Failed to fetch questionnaire template' },
            { status: 500 }
                );
    }
}

// PUT update a questionnaire template
export async function PUT(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    try {
          const body = await request.json();
          const { name, description, isPublic, questions } = body;

      // Update template
      const template = await prisma.questionnaireTemplate.update({
              where: { id: params.id },
              data: {
                        name,
                        description,
                        isPublic,
              },
              include: {
                        questions: true,
              },
      });

      // If questions provided, update them
      if (questions && Array.isArray(questions)) {
              // Delete old questions
            await prisma.questionnaireQuestion.deleteMany({
                      where: { templateId: params.id },
            });

            // Create new questions
            await prisma.questionnaireQuestion.createMany({
                      data: questions.map((q: any) => ({
                                  templateId: params.id,
                                  question: q.question,
                                  type: q.type,
                                  options: q.options || [],
                                  required: q.required ?? true,
                                  order: q.order,
                                  category: q.category,
                      })),
            });

            // Fetch updated template with new questions
            const updated = await prisma.questionnaireTemplate.findUnique({
                      where: { id: params.id },
                      include: {
                                  questions: {
                                                orderBy: { order: 'asc' },
                                  },
                      },
            });

            return NextResponse.json(updated);
      }

      return NextResponse.json(template);
    } catch (error) {
          console.error('PUT /api/questionnaires/[id]:', error);
          return NextResponse.json(
            { error: 'Failed to update questionnaire template' },
            { status: 500 }
                );
    }
}

// DELETE a questionnaire template
export async function DELETE(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    try {
          // Check if template exists
      const template = await prisma.questionnaireTemplate.findUnique({
              where: { id: params.id },
      });

      if (!template) {
              return NextResponse.json(
                { error: 'Questionnaire template not found' },
                { status: 404 }
                      );
      }

      // Delete questions first (due to foreign key constraint)
      await prisma.questionnaireQuestion.deleteMany({
              where: { templateId: params.id },
      });

      // Delete template
      await prisma.questionnaireTemplate.delete({
              where: { id: params.id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
          console.error('DELETE /api/questionnaires/[id]:', error);
          return NextResponse.json(
            { error: 'Failed to delete questionnaire template' },
            { status: 500 }
                );
    }
}
