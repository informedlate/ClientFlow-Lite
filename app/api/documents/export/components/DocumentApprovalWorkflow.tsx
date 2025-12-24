'use client';

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';

interface ApprovalStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
    reviewer: {
      name: string;
      email: string;
      avatar?: string;
    };
    timestamp?: string;
    comments?: string;
}

interface DocumentApprovalWorkflowProps {
    documentId: string;
    documentTitle: string;
    approvalSteps: ApprovalStep[];
    currentUserRole: 'creator' | 'reviewer' | 'admin';
    onApprove?: (stepId: string) => Promise<void>;
    onReject?: (stepId: string, reason: string) => Promise<void>;
    onRequestRevision?: (stepId: string, comments: string) => Promise<void>;
}

export const DocumentApprovalWorkflow: React.FC<DocumentApprovalWorkflowProps> = ({
    documentId,
    documentTitle,
    approvalSteps,
    currentUserRole,
    onApprove,
    onReject,
    onRequestRevision
}) => {
    const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedStep, setSelectedStep] = useState<ApprovalStep | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'revision'>('approve');
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getStatusColor = (status: ApprovalStep['status']): string => {
          switch (status) {
            case 'approved':
                      return 'bg-green-900 text-green-200';
            case 'rejected':
                      return 'bg-red-900 text-red-200';
            case 'revision_requested':
                      return 'bg-yellow-900 text-yellow-200';
            default:
                      return 'bg-slate-700 text-slate-200';
          }
    };

    const getStatusIcon = (status: ApprovalStep['status']): string => {
          switch (status) {
            case 'approved':
                      return '✓';
            case 'rejected':
                      return '✕';
            case 'revision_requested':
                      return '⚠';
            default:
                      return '○';
          }
    };

    const handleActionClick = (step: ApprovalStep, type: 'approve' | 'reject' | 'revision') => {
          setSelectedStep(step);
          setActionType(type);
          setComments('');
          setIsActionModalOpen(true);
    };

    const handleSubmitAction = async () => {
          if (!selectedStep) return;

          setIsLoading(true);
          try {
                  switch (actionType) {
                    case 'approve':
                                if (onApprove) await onApprove(selectedStep.id);
                                break;
                    case 'reject':
                                if (onReject) await onReject(selectedStep.id, comments);
                                break;
                    case 'revision':
                                if (onRequestRevision) await onRequestRevision(selectedStep.id, comments);
                                break;
                  }
                  setIsActionModalOpen(false);
                  setSelectedStep(null);
          } finally {
                  setIsLoading(false);
          }
    };

    const approvalProgress = approvalSteps.filter(s => s.status === 'approved').length;
    const totalSteps = approvalSteps.length;
    const progressPercentage = (approvalProgress / totalSteps) * 100;

    return (
          <div className="space-y-6">
            {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">{documentTitle}</h2>h2>
                        <p className="text-slate-300 text-sm mb-4">Approval Workflow</p>p>
                        
                  {/* Progress Bar */}
                        <div className="w-full bg-slate-700 rounded-full h-2">
                                  <div
                                                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercentage}%` }}
                                              />
                        </div>div>
                        <p className="text-slate-300 text-xs mt-2">
                          {approvalProgress} of {totalSteps} approvals complete
                        </p>p>
                </div>div>
          
            {/* Approval Steps */}
                <div className="space-y-4">
                  {approvalSteps.map((step, index) => (
                      <Card key={step.id}>
                                  <div
                                                  className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                                                  onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
                                                >
                                                <div className="flex items-start justify-between">
                                                                <div className="flex items-center gap-4">
                                                                  {/* Step Number */}
                                                                                  <div className="flex-shrink-0">
                                                                                                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-600">
                                                                                                                            <span className="text-indigo-300 font-semibold">{index + 1}</span>span>
                                                                                                        </div>div>
                                                                                    </div>div>
                                                                
                                                                  {/* Step Info */}
                                                                                  <div>
                                                                                                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>h3>
                                                                                                      <p className="text-slate-400 text-sm">{step.description}</p>p>
                                                                                                      <div className="flex items-center gap-2 mt-2">
                                                                                                                            <img
                                                                                                                                                      src={step.reviewer.avatar || 'https://via.placeholder.com/24'}
                                                                                                                                                      alt={step.reviewer.name}
                                                                                                                                                      className="w-6 h-6 rounded-full"
                                                                                                                                                    />
                                                                                                                            <span className="text-slate-300 text-sm">{step.reviewer.name}</span>span>
                                                                                                        </div>div>
                                                                                    </div>div>
                                                                </div>div>
                                                
                                                  {/* Status Badge */}
                                                                <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(step.status)}`}>
                                                                                  <span>{getStatusIcon(step.status)}</span>span>
                                                                                  <span className="capitalize">{step.status.replace(/_/g, ' ')}</span>span>
                                                                </div>div>
                                                </div>div>
                                  
                                    {/* Expanded Content */}
                                    {expandedStepId === step.id && (
                                                                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                                                                    {step.timestamp && (
                                                                                        <p className="text-slate-400 text-sm">
                                                                                                              <span className="font-semibold">Timestamp:</span>span> {new Date(step.timestamp).toLocaleString()}
                                                                                          </p>p>
                                                                                    )}
                                                                                    
                                                                    {step.comments && (
                                                                                        <div className="bg-slate-800/50 p-3 rounded">
                                                                                                              <p className="text-slate-300 text-sm">{step.comments}</p>p>
                                                                                          </div>div>
                                                                                    )}
                                                                  
                                                                    {/* Action Buttons */}
                                                                    {currentUserRole === 'reviewer' && step.status === 'pending' && (
                                                                                        <div className="flex gap-2">
                                                                                                              <Button
                                                                                                                                        onClick={() => handleActionClick(step, 'approve')}
                                                                                                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                                                                                                      >
                                                                                                                                      Approve
                                                                                                                </Button>Button>
                                                                                                              <Button
                                                                                                                                        onClick={() => handleActionClick(step, 'revision')}
                                                                                                                                        className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                                                                                                                                      >
                                                                                                                                      Request Revision
                                                                                                                </Button>Button>
                                                                                                              <Button
                                                                                                                                        onClick={() => handleActionClick(step, 'reject')}
                                                                                                                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                                                                                                                      >
                                                                                                                                      Reject
                                                                                                                </Button>Button>
                                                                                          </div>div>
                                                                                    )}
                                                                  </div>div>
                                                )}
                                  </div>div>
                      </Card>Card>
                    ))}
                </div>div>
          
            {/* Action Modal */}
                <Modal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} size="sm">
                        <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-white">
                                    {actionType === 'approve' && 'Approve Document'}
                                    {actionType === 'revision' && 'Request Revision'}
                                    {actionType === 'reject' && 'Reject Document'}
                                  </h3>h3>
                        
                          {(actionType === 'revision' || actionType === 'reject') && (
                        <textarea
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Add comments or feedback..."
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded p-3 text-sm"
                                        rows={4}
                                      />
                      )}
                        
                                  <div className="flex gap-2 justify-end">
                                              <Button onClick={() => setIsActionModalOpen(false)} variant="secondary">
                                                            Cancel
                                              </Button>Button>
                                              <Button onClick={handleSubmitAction} disabled={isLoading}>
                                                {isLoading ? 'Processing...' : 'Confirm'}
                                              </Button>Button>
                                  </div>div>
                        </div>div>
                </Modal>Modal>
          </div>div>
        );
};</div>
