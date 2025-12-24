import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all questionnaire templates for a client (or public templates)
export async function GET(request: NextRequest) {
    try {
          const searchParams = request.nextUrl.searchParams;
          const clientId = searchParams.get('clientId');

      if (clientId) {
              // Get templates created by this client's designer
            const templates = await prisma.questionnaireTemplate.findMany({
                      where: {
                                  OR: [
                                    { createdByDesignerId: clientId },
                                    { isPublic: true },
                                              ],
                      },
                      include: {
                                  questions: true,
                      },
                      orderBy: { createdAt: 'desc' },
            });
              return NextResponse.json(templates);
      } else {
              // Get all public templates
            const templates = await prisma.questionnaireTemplate.findMany({
                      where: { isPublic: true },
                      include: {
                                  questions: true,
                      },
                      orderBy: { createdAt: 'desc' },
            });
              return NextResponse.json(templates);
      }
    } catch (error) {
          console.error('GET /api/questionnaires:', error);
          return NextResponse.json(
            { error: 'Failed to fetch questionnaire templates' },
            { status: 500 }
                );
    }
}

// POST create a new questionnaire template or submit a questionnaire response
export async function POST(request: NextRequest) {
    try {
          const body = await request.json();
          const { type, ...data } = body;

      // Type can be 'template' (create a template) or 'response' (submit answers)
      if (type === 'template') {
              const { name, description, projectType, isPublic, questions } = data;

            if (!name) {
                      return NextResponse.json(
                        { error: 'Template name is required' },
                        { status: 400 }
                                );
            }

            const template = await prisma.questionnaireTemplate.create({
                      data: {
                                  name,
                                  description: description || '',
                                  projectType: projectType || 'general',
                                  isPublic: isPublic || false,
                                  createdByDesignerId: data.createdByDesignerId,
                                  questions: {
                                                create: (questions || []).map((q: any) => ({
                                                                question: q.question,
                                                                type: q.type, // 'text', 'multiline', 'multiple_choice', 'checkbox', 'file_upload'
                                                                options: q.options || [],
                                                                required: q.required ?? true,
                                                                order: q.order,
                                                                category: q.category,
                                                })),
                                  },
                      },
                      include: {
                                  questions: true,
                      },
            });

            return NextResponse.json(template, { status: 201 });
      } else if (type === 'response') {
              const { templateId, clientId, answers } = data;

            if (!templateId || !clientId) {
                      return NextResponse.json(
                        { error: 'Template ID and Client ID are required' },
                        { status: 400 }
                                );
            }

            const response = await prisma.questionnaireResponse.create({
                      data: {
                                  templateId,
                                  clientId,
                                  answers, // Store as JSON
                                  status: 'submitted',
                      },
            });

            return NextResponse.json(response, { status: 201 });
      } else {
              return NextResponse.json(
                { error: 'Invalid request type' },
                { status: 400 }
                      );
      }
    } catch (error) {
          console.error('POST /api/questionnaires:', error);
          return NextResponse.json(
            { error: 'Failed to process questionnaire request' },
            { status: 500 }
                );
    }
}
