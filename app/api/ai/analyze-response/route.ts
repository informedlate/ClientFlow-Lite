import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { createClaudeClient } from '@/lib/claude';

interface QuestionnaireAnswer {
    questionId: string;
    questionText: string;
    category: string;
    answer: string | string[] | number;
    type: string;
}

interface AnalysisResult {
    completenessScore: number;
    completenessPercentage: number;
    missingInformation: string[];
    suggestedFollowUps: Array<{
      question: string;
      purpose: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    insights: {
      businessMaturity: string;
      projectScope: string;
      technicalComplexity: string;
      timeline: string;
    };
    risks: Array<{
      risk: string;
      severity: 'high' | 'medium' | 'low';
      recommendation: string;
    }>;
    summary: string;
}

export async function POST(request: NextRequest) {
    try {
          const session = await getServerSession();
          if (!session?.user?.email) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

      const body = await request.json();
          const { responseId, answers } = body;

      if (!responseId || !answers || !Array.isArray(answers)) {
              return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
                      );
      }

      // Verify user owns this response
      const response = await prisma.questionnaireResponse.findUnique({
              where: { id: responseId },
              include: { client: true, template: true },
      });

      if (!response) {
              return NextResponse.json({ error: 'Response not found' }, { status: 404 });
      }

      // Create analysis prompt
      const answersText = answers
            .map(
                      (a: QuestionnaireAnswer) =>
                                  `Q: ${a.questionText} (${a.category})\nA: ${Array.isArray(a.answer) ? a.answer.join(', ') : a.answer}`
                    )
            .join('\n\n');

      const analysisPrompt = `You are an expert project consultant analyzing client questionnaire responses. Analyze the following responses and provide a comprehensive assessment.

      QUESTIONNAIRE RESPONSES:
      ${answersText}

      PROJECT NAME: ${response.template?.name || 'Unknown Project'}
      CLIENT: ${response.client?.name || 'Unknown Client'}

      Provide a detailed analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
      {
        "completenessScore": <number 0-100>,
          "completenessPercentage": <number 0-100>,
            "missingInformation": [<list of 3-5 key missing pieces of information>],
              "suggestedFollowUps": [
                  {
                        "question": "<specific follow-up question>",
                              "purpose": "<why this question matters>",
                                    "priority": "high|medium|low"
                                        }
                                          ],
                                            "insights": {
                                                "businessMaturity": "<assessment of business maturity level>",
                                                    "projectScope": "<assessment of project scope clarity>",
                                                        "technicalComplexity": "<assessment of technical complexity>",
                                                            "timeline": "<assessment of timeline feasibility>"
                                                              },
                                                                "risks": [
                                                                    {
                                                                          "risk": "<identified risk>",
                                                                                "severity": "high|medium|low",
                                                                                      "recommendation": "<recommendation to mitigate>"
                                                                                          }
                                                                                            ],
                                                                                              "summary": "<2-3 sentence executive summary of the project>"
                                                                                              }`;

      // Call Claude API for analysis
      const claudeClient = createClaudeClient();
          const message = await claudeClient.messages.create({
                  model: 'claude-3-5-sonnet-20241022',
                  max_tokens: 1024,
                  messages: [
                    {
                                role: 'user',
                                content: analysisPrompt,
                    },
                          ],
          });

      // Parse response
      const responseText =
              message.content[0].type === 'text' ? message.content[0].text : '';

      let analysis: AnalysisResult;
          try {
                  analysis = JSON.parse(responseText);
          } catch (e) {
                  console.error('Failed to parse Claude response:', responseText);
                  return NextResponse.json(
                    { error: 'Failed to parse AI analysis' },
                    { status: 500 }
                          );
          }

      // Save analysis to database
      const savedAnalysis = await prisma.responseAnalysis.create({
              data: {
                        responseId,
                        completenessScore: analysis.completenessScore,
                        missingInformation: analysis.missingInformation,
                        suggestedFollowUps: analysis.suggestedFollowUps,
                        insights: analysis.insights,
                        risks: analysis.risks,
                        summary: analysis.summary,
                        generatedAt: new Date(),
              },
      });

      return NextResponse.json(
        {
                  success: true,
                  analysis: savedAnalysis,
        },
        { status: 200 }
            );
    } catch (error) {
          console.error('Error analyzing response:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
                );
    }
}
