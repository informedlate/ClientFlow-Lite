import { createClaudeClient } from './claude';

export interface ScopeDocumentRequest {
    projectName: string;
    clientName: string;
    questionnaireSummary: string;
    projectGoals: string[];
    designPreferences: string;
    contentRequirements: string;
    technicalRequirements: string;
    timeline: string;
    budget?: string;
}

export interface ScopeDocument {
    projectName: string;
    clientName: string;
    executiveSummary: string;
    projectOverview: string;
    objectives: string[];
    scope: {
      included: string[];
      excluded: string[];
      constraints: string[];
    };
    deliverables: Array<{
      name: string;
      description: string;
      deadline: string;
    }>;
    timeline: {
      phases: Array<{
        name: string;
        duration: string;
        activities: string[];
      }>;
      totalDuration: string;
    };
    assumptions: string[];
    risks: Array<{
      risk: string;
      mitigation: string;
    }>;
    communicationPlan: {
      frequency: string;
      channels: string[];
      stakeholders: string[];
    };
    successCriteria: string[];
    nextSteps: string[];
    generatedAt: Date;
}

export async function generateScopeDocument(
    request: ScopeDocumentRequest
  ): Promise<ScopeDocument> {
    const prompt = `Generate a professional project scope document in JSON format based on the following information:

    Project Name: ${request.projectName}
    Client: ${request.clientName}
    Goals: ${request.projectGoals.join(', ')}
    Design Preferences: ${request.designPreferences}
    Content Requirements: ${request.contentRequirements}
    Technical Requirements: ${request.technicalRequirements}
    Timeline: ${request.timeline}
    Budget: ${request.budget || 'Not specified'}

    Questionnaire Summary:
    ${request.questionnaireSummary}

    Generate a comprehensive scope document in valid JSON format (ONLY JSON, no markdown) with the following structure:
    {
      "projectName": "${request.projectName}",
        "clientName": "${request.clientName}",
          "executiveSummary": "<2-3 sentences summarizing the project>",
            "projectOverview": "<detailed overview of what the project entails>",
              "objectives": ["<objective 1>", "<objective 2>", "<objective 3>"],
                "scope": {
                    "included": ["<item 1>", "<item 2>", "<item 3>"],
                        "excluded": ["<item 1>", "<item 2>"],
                            "constraints": ["<constraint 1>", "<constraint 2>"]
                              },
                                "deliverables": [
                                    {
                                          "name": "<deliverable name>",
                                                "description": "<detailed description>",
                                                      "deadline": "<estimated deadline>"
                                                          }
                                                            ],
                                                              "timeline": {
                                                                  "phases": [
                                                                        {
                                                                                "name": "<phase name>",
                                                                                        "duration": "<duration in weeks>",
                                                                                                "activities": ["<activity 1>", "<activity 2>"]
                                                                                                      }
                                                                                                          ],
                                                                                                              "totalDuration": "<total project duration>"
                                                                                                                },
                                                                                                                  "assumptions": ["<assumption 1>", "<assumption 2>"],
                                                                                                                    "risks": [
                                                                                                                        {
                                                                                                                              "risk": "<potential risk>",
                                                                                                                                    "mitigation": "<how to mitigate>"
                                                                                                                                        }
                                                                                                                                          ],
                                                                                                                                            "communicationPlan": {
                                                                                                                                                "frequency": "<e.g., weekly, bi-weekly>",
                                                                                                                                                    "channels": ["<channel 1>", "<channel 2>"],
                                                                                                                                                        "stakeholders": ["<stakeholder 1>", "<stakeholder 2>"]
                                                                                                                                                          },
                                                                                                                                                            "successCriteria": ["<criterion 1>", "<criterion 2>", "<criterion 3>"],
                                                                                                                                                              "nextSteps": ["<step 1>", "<step 2>", "<step 3>"]
                                                                                                                                                              }`;

  try {
        const claudeClient = createClaudeClient();
        const message = await claudeClient.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2048,
                messages: [
                  {
                              role: 'user',
                              content: prompt,
                  },
                        ],
        });

      const responseText =
              message.content[0].type === 'text' ? message.content[0].text : '';

      let documentData: Omit<ScopeDocument, 'generatedAt'>;
        try {
                documentData = JSON.parse(responseText);
        } catch (e) {
                console.error('Failed to parse scope document response:', responseText);
                throw new Error('Failed to generate scope document: Invalid response format');
        }

      return {
              ...documentData,
              generatedAt: new Date(),
      };
  } catch (error) {
        console.error('Error generating scope document:', error);
        throw error;
  }
}

export function formatScopeDocumentAsMarkdown(doc: ScopeDocument): string {
    const lines: string[] = [];

  lines.push(`# Project Scope Document`);
    lines.push('');
    lines.push(`**Project:** ${doc.projectName}`);
    lines.push(`**Client:** ${doc.clientName}`);
    lines.push(`**Generated:** ${doc.generatedAt.toLocaleDateString()}`);
    lines.push('');

  lines.push(`## Executive Summary`);
    lines.push(doc.executiveSummary);
    lines.push('');

  lines.push(`## Project Overview`);
    lines.push(doc.projectOverview);
    lines.push('');

  lines.push(`## Objectives`);
    doc.objectives.forEach((obj) => lines.push(`- ${obj}`));
    lines.push('');

  lines.push(`## Scope`);
    lines.push(`### Included`);
    doc.scope.included.forEach((item) => lines.push(`- ${item}`));
    lines.push(`### Excluded`);
    doc.scope.excluded.forEach((item) => lines.push(`- ${item}`));
    lines.push(`### Constraints`);
    doc.scope.constraints.forEach((item) => lines.push(`- ${item}`));
    lines.push('');

  lines.push(`## Deliverables`);
    doc.deliverables.forEach((d) => {
          lines.push(`- **${d.name}** (Due: ${d.deadline})`);
          lines.push(`  ${d.description}`);
    });
    lines.push('');

  lines.push(`## Timeline`);
    doc.timeline.phases.forEach((phase) => {
          lines.push(`### ${phase.name} (${phase.duration})`);
          phase.activities.forEach((activity) => lines.push(`- ${activity}`));
    });
    lines.push(`**Total Duration:** ${doc.timeline.totalDuration}`);
    lines.push('');

  lines.push(`## Assumptions`);
    doc.assumptions.forEach((a) => lines.push(`- ${a}`));
    lines.push('');

  lines.push(`## Risks & Mitigation`);
    doc.risks.forEach((r) => {
          lines.push(`- **${r.risk}**`);
          lines.push(`  Mitigation: ${r.mitigation}`);
    });
    lines.push('');

  lines.push(`## Communication Plan`);
    lines.push(`- **Frequency:** ${doc.communicationPlan.frequency}`);
    lines.push(`- **Channels:** ${doc.communicationPlan.channels.join(', ')}`);
    lines.push(`- **Stakeholders:** ${doc.communicationPlan.stakeholders.join(', ')}`);
    lines.push('');

  lines.push(`## Success Criteria`);
    doc.successCriteria.forEach((c) => lines.push(`- ${c}`));
    lines.push('');

  lines.push(`## Next Steps`);
    doc.nextSteps.forEach((step) => lines.push(`- ${step}`));
    lines.push('');

  return lines.join('\n');
}
