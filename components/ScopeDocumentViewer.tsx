'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface ScopeDocument {
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
    generatedAt: string;
}

interface ScopeDocumentViewerProps {
    document: ScopeDocument;
    onDownload?: () => void;
    onApprove?: () => void;
    onRevise?: () => void;
}

export function ScopeDocumentViewer({
    document,
    onDownload,
    onApprove,
    onRevise,
}: ScopeDocumentViewerProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
  };

  return (
        <div className="space-y-6">
          {/* Header */}
              <div className="border-b border-slate-700 pb-6">
                      <h1 className="text-4xl font-bold text-white mb-2">{document.projectName}</h1>h1>
                      <p className="text-slate-400">For: {document.clientName}</p>p>
                      <p className="text-slate-500 text-sm mt-2">
                                Generated: {new Date(document.generatedAt).toLocaleDateString()}
                      </p>p>
              </div>div>
        
          {/* Action Buttons */}
              <div className="flex gap-3">
                {onApprove && (
                    <Button onClick={onApprove} className="flex-1">
                                ✓ Approve
                    </Button>Button>
                      )}
                {onRevise && (
                    <Button onClick={onRevise} variant="secondary" className="flex-1">
                                Revise
                    </Button>Button>
                      )}
                {onDownload && (
                    <Button onClick={onDownload} variant="ghost" className="flex-1">
                                ⬇ Download PDF
                    </Button>Button>
                      )}
              </div>div>
        
          {/* Executive Summary */}
              <Card>
                      <button
                                  onClick={() => toggleSection('summary')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Executive Summary
                                </h2>h2>
                      </button>button>
                {expandedSection === 'summary' && (
                    <p className="text-slate-300 mt-4 leading-relaxed">
                      {document.executiveSummary}
                    </p>p>
                      )}
              </Card>Card>
        
          {/* Project Overview */}
              <Card>
                      <button
                                  onClick={() => toggleSection('overview')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Project Overview
                                </h2>h2>
                      </button>button>
                {expandedSection === 'overview' && (
                    <p className="text-slate-300 mt-4 leading-relaxed">
                      {document.projectOverview}
                    </p>p>
                      )}
              </Card>Card>
        
          {/* Objectives */}
              <Card>
                      <button
                                  onClick={() => toggleSection('objectives')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Objectives ({document.objectives.length})
                                </h2>h2>
                      </button>button>
                {expandedSection === 'objectives' && (
                    <ul className="mt-4 space-y-2">
                      {document.objectives.map((obj, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-300">
                                                    <span className="text-indigo-500 font-bold">{idx + 1}.</span>span>
                                                    <span>{obj}</span>span>
                                    </li>li>
                                  ))}
                    </ul>ul>
                      )}
              </Card>Card>
        
          {/* Scope */}
              <Card>
                      <button
                                  onClick={() => toggleSection('scope')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Scope
                                </h2>h2>
                      </button>button>
                {expandedSection === 'scope' && (
                    <div className="mt-4 space-y-4">
                                <div>
                                              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Included</h3>h3>
                                              <ul className="space-y-1">
                                                {document.scope.included.map((item, idx) => (
                                        <li key={idx} className="text-slate-300">✓ {item}</li>li>
                                      ))}
                                              </ul>ul>
                                </div>div>
                                <div>
                                              <h3 className="text-lg font-semibold text-red-400 mb-2">Excluded</h3>h3>
                                              <ul className="space-y-1">
                                                {document.scope.excluded.map((item, idx) => (
                                        <li key={idx} className="text-slate-300">✗ {item}</li>li>
                                      ))}
                                              </ul>ul>
                                </div>div>
                                <div>
                                              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Constraints</h3>h3>
                                              <ul className="space-y-1">
                                                {document.scope.constraints.map((item, idx) => (
                                        <li key={idx} className="text-slate-300">⚠ {item}</li>li>
                                      ))}
                                              </ul>ul>
                                </div>div>
                    </div>div>
                      )}
              </Card>Card>
        
          {/* Deliverables */}
              <Card>
                      <button
                                  onClick={() => toggleSection('deliverables')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Deliverables ({document.deliverables.length})
                                </h2>h2>
                      </button>button>
                {expandedSection === 'deliverables' && (
                    <div className="mt-4 space-y-3">
                      {document.deliverables.map((d, idx) => (
                                    <div key={idx} className="bg-slate-800 p-3 rounded border-l-2 border-indigo-500">
                                                    <h4 className="font-semibold text-white">{d.name}</h4>h4>
                                                    <p className="text-sm text-slate-400 mt-1">{d.description}</p>p>
                                                    <p className="text-xs text-slate-500 mt-2">Due: {d.deadline}</p>p>
                                    </div>div>
                                  ))}
                    </div>div>
                      )}
              </Card>Card>
        
          {/* Timeline */}
              <Card>
                      <button
                                  onClick={() => toggleSection('timeline')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Timeline
                                </h2>h2>
                      </button>button>
                {expandedSection === 'timeline' && (
                    <div className="mt-4 space-y-4">
                      {document.timeline.phases.map((phase, idx) => (
                                    <div key={idx} className="border-l-2 border-indigo-500 pl-4">
                                                    <h3 className="font-semibold text-white">
                                                      {phase.name} ({phase.duration})
                                                    </h3>h3>
                                                    <ul className="mt-2 space-y-1">
                                                      {phase.activities.map((activity, aidx) => (
                                                          <li key={aidx} className="text-sm text-slate-400">• {activity}</li>li>
                                                        ))}
                                                    </ul>ul>
                                    </div>div>
                                  ))}
                                <p className="text-slate-300 font-semibold mt-4">
                                              Total Duration: {document.timeline.totalDuration}
                                </p>p>
                    </div>div>
                      )}
              </Card>Card>
        
          {/* Risks & Mitigation */}
              <Card>
                      <button
                                  onClick={() => toggleSection('risks')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Risks & Mitigation ({document.risks.length})
                                </h2>h2>
                      </button>button>
                {expandedSection === 'risks' && (
                    <div className="mt-4 space-y-3">
                      {document.risks.map((r, idx) => (
                                    <div key={idx} className="bg-slate-800 p-3 rounded">
                                                    <p className="font-semibold text-red-400">⚠ {r.risk}</p>p>
                                                    <p className="text-sm text-slate-400 mt-2">Mitigation: {r.mitigation}</p>p>
                                    </div>div>
                                  ))}
                    </div>div>
                      )}
              </Card>Card>
        
          {/* Communication & Success */}
              <div className="grid grid-cols-2 gap-4">
                      <Card>
                                <button
                                              onClick={() => toggleSection('communication')}
                                              className="w-full text-left"
                                            >
                                            <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition">
                                                          Communication Plan
                                            </h3>h3>
                                </button>button>
                        {expandedSection === 'communication' && (
                      <div className="mt-3 space-y-2">
                                    <p className="text-sm text-slate-300">
                                                    <span className="text-indigo-400">Frequency:</span>span> {document.communicationPlan.frequency}
                                    </p>p>
                                    <p className="text-sm text-slate-300">
                                                    <span className="text-indigo-400">Channels:</span>span> {document.communicationPlan.channels.join(', ')}
                                    </p>p>
                      </div>div>
                                )}
                      </Card>Card>
              
                      <Card>
                                <button
                                              onClick={() => toggleSection('criteria')}
                                              className="w-full text-left"
                                            >
                                            <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition">
                                                          Success Criteria ({document.successCriteria.length})
                                            </h3>h3>
                                </button>button>
                        {expandedSection === 'criteria' && (
                      <ul className="mt-3 space-y-1">
                        {document.successCriteria.map((c, idx) => (
                                        <li key={idx} className="text-xs text-slate-300">✓ {c}</li>li>
                                      ))}
                      </ul>ul>
                                )}
                      </Card>Card>
              </div>div>
        
          {/* Next Steps */}
              <Card>
                      <button
                                  onClick={() => toggleSection('nextsteps')}
                                  className="w-full text-left"
                                >
                                <h2 className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                                            Next Steps
                                </h2>h2>
                      </button>button>
                {expandedSection === 'nextsteps' && (
                    <ol className="mt-4 space-y-2">
                      {document.nextSteps.map((step, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-300">
                                                    <span className="text-indigo-500 font-bold">{idx + 1}.</span>span>
                                                    <span>{step}</span>span>
                                    </li>li>
                                  ))}
                    </ol>ol>
                      )}
              </Card>Card>
        
          {/* Footer Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-700">
                {onApprove && (
                    <Button onClick={onApprove} className="flex-1">
                                ✓ Approve Scope
                    </Button>Button>
                      )}
                {onRevise && (
                    <Button onClick={onRevise} variant="secondary" className="flex-1">
                                Request Revisions
                    </Button>Button>
                      )}
              </div>div>
        </div>div>
      );
}</div>
