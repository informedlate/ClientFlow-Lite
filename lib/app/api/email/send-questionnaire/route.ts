import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { sendQuestionnaireLink, sendFollowUpEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
          const session = await getServerSession();
          if (!session?.user?.email) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

      const body = await request.json();
          const { clientEmail, clientName, projectName, templateId, expiresAt } = body;

      if (!clientEmail || !clientName || !projectName || !templateId) {
              return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
                      );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(clientEmail)) {
                  return NextResponse.json(
                    { error: 'Invalid email format' },
                    { status: 400 }
                          );
          }

      // Create questionnaire response record
      const response = await prisma.questionnaireResponse.create({
              data: {
                        templateId,
                        clientId: session.user.id || '',
                        status: 'pending_response',
                        sentAt: new Date(),
              },
      });

      // Generate questionnaire URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const questionnaireUrl = `${baseUrl}/questionnaires/${response.id}/fill`;

      // Send questionnaire email
      const expiresDate = expiresAt ? new Date(expiresAt) : undefined;
          await sendQuestionnaireLink({
                  clientEmail,
                  clientName,
                  projectName,
                  questionnaireUrl,
                  expiresAt: expiresDate,
          });

      // Log email event
      await prisma.emailLog.create({
              data: {
                        responseId: response.id,
                        recipientEmail: clientEmail,
                        type: 'questionnaire_sent',
                        status: 'sent',
                        sentAt: new Date(),
              },
      });

      return NextResponse.json(
        {
                  success: true,
                  responseId: response.id,
                  message: 'Questionnaire email sent successfully',
        },
        { status: 200 }
            );
    } catch (error) {
          console.error('Error sending questionnaire email:', error);
          return NextResponse.json(
            { error: 'Failed to send email' },
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

      const emailLogs = await prisma.emailLog.findMany({
              where: { responseId },
              orderBy: { sentAt: 'desc' },
      });

      return NextResponse.json(
        {
                  success: true,
                  emailLogs,
        },
        { status: 200 }
            );
    } catch (error) {
          console.error('Error retrieving email logs:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
                );
    }
}
