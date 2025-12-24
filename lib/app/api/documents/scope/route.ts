import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import {
    generateScopeDocument,
    formatScopeDocumentAsMarkdown,
    ScopeDocumentRequest,
} from '@/lib/document-generator';

export async function POST(request: NextRequest) {
    try {
          const session = await getServerSession();
          if (!session?.user?.email) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

      const body = await request.json();
          const {
                  projectName,
                  clientName,
                  responseId,
                  projectGoals,
                  designPreferences,
                  contentRequirements,
                  technicalRequirements,
                  timeline,
                  budget,
          }: any = body;

      // Validate required fields
      if (!projectName || !clientName || !responseId) {
              return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
                      );
      }

      // Get the questionnaire response to extract summary
      const response = await prisma.questionnaireResponse.findUnique({
              where: { id: responseId },
              include: {
                        analysis: true,
              },
      });

      if (!response) {
              return NextResponse.json(
                { error: 'Response not found' },
                { status: 404 }
                      );
      }

      // Create summary from analysis
      const questionnaireSummary = response.analysis?.summary || 'Questionnaire analysis pending';

      // Generate scope document
      const scopeRequest: ScopeDocumentRequest = {
              projectName,
              clientName,
              questionnaireSummary,
              projectGoals: projectGoals || [],
              designPreferences: designPreferences || 'Not specified',
              contentRequirements: contentRequirements || 'Not specified',
              technicalRequirements: technicalRequirements || 'Not specified',
              timeline: timeline || 'To be determined',
              budget,
      };

      const scopeDocument = await generateScopeDocument(scopeRequest);

      // Convert to markdown
      const markdownContent = formatScopeDocumentAsMarkdown(scopeDocument);

      // Save document to database
      const savedDocument = await prisma.scopeDocument.create({
              data: {
                        responseId,
                        clientId: response.clientId,
                        projectName,
                        content: JSON.stringify(scopeDocument),
                        markdownContent,
                        generatedAt: new Date(),
              },
      });

      return NextResponse.json(
        {
                  success: true,
                  document: savedDocument,
                  documentData: scopeDocument,
        },
        { status: 200 }
            );
    } catch (error) {
          console.error('Error generating scope document:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
                );
    }
}

export async function GET(request: NextRequest) {
    try {
          const session = await getServerSession();
          if (!session?.user?.email) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

      const { searchParams } = new URL(request.url);
          const responseId = searchParams.get('responseId');

      if (!responseId) {
              return NextResponse.json(
                { error: 'Missing responseId parameter' },
                { status: 400 }
                      );
      }

      const document = await prisma.scopeDocument.findUnique({
              where: { responseId },
      });

      if (!document) {
              return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
                      );
      }

      return NextResponse.json(
        {
                  success: true,
                  document,
                  documentData: JSON.parse(document.content),
        },
        { status: 200 }
            );
    } catch (error) {
          console.error('Error retrieving scope document:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
                );
    }
}
