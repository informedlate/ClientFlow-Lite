import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalysisResult {
    summary: string;
    keyPoints: string[];
    followUpQuestions: string[];
    scopeRecommendations: string[];
    estimatedComplexity: "low" | "medium" | "high";
}

export interface QuestionnaireResponse {
    questionId: string;
    response: string;
}

/**
 * Analyze questionnaire responses using Claude AI
 * Generates summary, key points, follow-up questions, and scope recommendations
 */
export async function analyzeQuestionnaireResponses(
    responses: QuestionnaireResponse[],
    projectContext: string
  ): Promise<AnalysisResult> {
    const responseText = responses
      .map((r) => `Q: ${r.questionId}\nA: ${r.response}`)
      .join("\n\n");

  const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        messages: [
          {
                    role: "user",
                    content: `You are a design project consultant analyzing client questionnaire responses.

                    Project Context: ${projectContext}

                    Client Responses:
                    ${responseText}

                    Please analyze these responses and provide:
                    1. A concise summary of the client's needs
                    2. 3-5 key points from the responses
                    3. 3-5 follow-up questions to clarify scope
                    4. Initial scope recommendations
                    5. Estimated project complexity (low/medium/high)

                    Format your response as JSON with keys: summary, keyPoints (array), followUpQuestions (array), scopeRecommendations (array), estimatedComplexity (string)`,
          },
              ],
  });

  const responseText_content = message.content[0];
    if (responseText_content.type !== "text") {
          throw new Error("Unexpected response type from Claude");
    }

  const jsonMatch = responseText_content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
          throw new Error("Could not parse JSON response from Claude");
    }

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}

/**
 * Generate a scope document based on questionnaire analysis
 */
export async function generateScopeDocument(
    analysis: AnalysisResult,
    clientName: string,
    projectName: string
  ): Promise<string> {
    const message = await client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 3000,
          messages: [
            {
                      role: "user",
                      content: `Generate a professional project scope document for a design project.

                      Client: ${clientName}
                      Project: ${projectName}

                      Analysis Summary: ${analysis.summary}
                      Key Points: ${analysis.keyPoints.join("; ")}
                      Scope Recommendations: ${analysis.scopeRecommendations.join("; ")}
                      Estimated Complexity: ${analysis.estimatedComplexity}

                      Create a comprehensive scope document that includes:
                      1. Project Overview
                      2. Client Objectives
                      3. Deliverables
                      4. Timeline and Milestones
                      5. Budget Considerations
                      6. Terms and Conditions

                      Format the document in markdown with proper headings and structure.`,
            },
                ],
    });

  const scopeContent = message.content[0];
    if (scopeContent.type !== "text") {
          throw new Error("Unexpected response type from Claude");
    }

  return scopeContent.text;
}

/**
 * Generate AI follow-up questions based on initial responses
 */
export async function generateFollowUpQuestions(
    responses: QuestionnaireResponse[],
    existingQuestions: string[]
  ): Promise<string[]> {
    const responseText = responses
      .map((r) => `${r.questionId}: ${r.response}`)
      .join("\n");

  const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: [
          {
                    role: "user",
                    content: `You are a design consultant creating follow-up questions for a client questionnaire.

                    Already Asked Questions:
                    ${existingQuestions.map((q) => `- ${q}`).join("\n")}

                    Client Responses So Far:
                    ${responseText}

                    Generate 3-5 NEW follow-up questions that:
                    1. Clarify ambiguous responses
                    2. Dig deeper into important areas
                    3. Uncover hidden requirements
                    4. Help estimate project scope better

                    Return only the questions as a numbered list, one per line.`,
          },
              ],
  });

  const content = message.content[0];
    if (content.type !== "text") {
          throw new Error("Unexpected response type from Claude");
    }

  const questions = content.text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

  return questions;
}
