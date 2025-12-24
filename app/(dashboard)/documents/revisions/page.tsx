'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface DocumentRevision {
    id: string;
    documentId: string;
    documentTitle: string;
    versionNumber: number;
    status: 'draft' | 'in_review' | 'approved' | 'archived';
    createdAt: string;
    createdBy: {
      name: string;
      email: string;
    };
    changes: {
      added: number;
      modified: number;
      deleted: number;
    };
    reviewStatus?: {
      approved: number;
      pending: number;
      rejected: number;
    };
    fileSize: number;
}

export default function DocumentRevisionsPage() {
    const [revisions, setRevisions] = useState<DocumentRevision[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'version'>('newest');
    const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'in_review' | 'approved'>('all');
    const [selectedRevision, setSelectedRevision] = useState<DocumentRevision | null>(null);

  useEffect(() => {
        // Fetch revisions data
                const loadRevisions = async () => {
                        try {
                                  setIsLoading(true);
                                  // Mock data - replace with actual API call
                          const mockRevisions: DocumentRevision[] = [
                            {
                                          id: 'rev1',
                                          documentId: 'doc1',
                                          documentTitle: 'Project Scope Document',
                                          versionNumber: 3,
                                          status: 'approved',
                                          createdAt: new Date(Date.now() - 86400000).toISOString(),
                                          createdBy: { name: 'John Doe', email: 'john@example.com' },
                                          changes: { added: 245, modified: 89, deleted: 12 },
                                          reviewStatus: { approved: 3, pending: 0, rejected: 0 },
                                          fileSize: 124500
                            },
                            {
                                          id: 'rev2',
                                          documentId: 'doc1',
                                          documentTitle: 'Project Scope Document',
                                          versionNumber: 2,
                                          status: 'in_review',
                                          createdAt: new Date(Date.now() - 172800000).toISOString(),
                                          createdBy: { name: 'Jane Smith', email: 'jane@example.com' },
                                          changes: { added: 156, modified: 43, deleted: 8 },
                                          reviewStatus: { approved: 2, pending: 1, rejected: 0 },
                                          fileSize: 98200
                            },
                            {
                                          id: 'rev3',
                                          documentId: 'doc2',
                                          documentTitle: 'Contract Terms',
                                          versionNumber: 1,
                                          status: 'draft',
                                          createdAt: new Date(Date.now() - 259200000).toISOString(),
                                          createdBy: { name: 'Bob Wilson', email: 'bob@example.com' },
                                          changes: { added: 892, modified: 0, deleted: 0 },
                                          reviewStatus: { approved: 0, pending: 2, rejected: 0 },
                                          fileSize: 156300
                            }
                                    ];

                          setRevisions(mockRevisions);
                        } catch (error) {
                                  console.error('Failed to load revisions:', error);
                        } finally {
                                  setIsLoading(false);
                        }
                };

                loadRevisions();
  }, []);

  const getStatusColor = (status: DocumentRevision['status']): string => {
        switch (status) {
          case 'approved':
                    return 'bg-green-900/20 text-green-300 border-green-700';
          case 'in_review':
                    return 'bg-yellow-900/20 text-yellow-300 border-yellow-700';
          case 'draft':
                    return 'bg-slate-700/20 text-slate-300 border-slate-600';
          default:
                    return 'bg-gray-900/20 text-gray-300 border-gray-700';
        }
  };

  const getStatusIcon = (status: DocumentRevision['status']): string => {
        switch (status) {
          case 'approved':
                    return '✓';
          case 'in_review':
                    return '⟳';
          case 'draft':
                    return '✎';
          default:
                    return '○';
        }
  };

  const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredRevisions = revisions
      .filter(rev => filterStatus === 'all' || rev.status === filterStatus)
      .sort((a, b) => {
              if (sortBy === 'newest') {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              } else if (sortBy === 'oldest') {
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              } else {
                        return b.versionNumber - a.versionNumber;
              }
      });

  return (
        <div className="space-y-6">
          {/* Header */}
              <div>
                      <h1 className="text-3xl font-bold text-white mb-2">Document Revisions</h1>h1>
                      <p className="text-slate-400">Track and manage all document versions and changes</p>p>
              </div>div>
        
          {/* Controls */}
              <div className="flex gap-4 flex-wrap">
                      <div>
                                <label className="text-slate-400 text-sm block mb-2">Sort By</label>label>
                                <select
                                              value={sortBy}
                                              onChange={(e) => setSortBy(e.target.value as any)}
                                              className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 text-sm"
                                            >
                                            <option value="newest">Newest First</option>option>
                                            <option value="oldest">Oldest First</option>option>
                                            <option value="version">Version Number</option>option>
                                </select>select>
                      </div>div>
              
                      <div>
                                <label className="text-slate-400 text-sm block mb-2">Filter Status</label>label>
                                <select
                                              value={filterStatus}
                                              onChange={(e) => setFilterStatus(e.target.value as any)}
                                              className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 text-sm"
                                            >
                                            <option value="all">All</option>option>
                                            <option value="draft">Draft</option>option>
                                            <option value="in_review">In Review</option>option>
                                            <option value="approved">Approved</option>option>
                                </select>select>
                      </div>div>
              </div>div>
        
          {/* Revisions List */}
          {isLoading ? (
                  <div className="text-center text-slate-400 py-12">
                            <p>Loading revisions...</p>p>
                  </div>div>
                ) : filteredRevisions.length === 0 ? (
                  <Card>
                            <div className="text-center text-slate-400 py-12">
                                        <p>No revisions found</p>p>
                            </div>div>
                  </Card>Card>
                ) : (
                  <div className="space-y-3">
                    {filteredRevisions.map((revision) => (
                                <Card key={revision.id} className="hover:border-indigo-600 transition-colors">
                                              <div
                                                                className="p-4 cursor-pointer"
                                                                onClick={() => setSelectedRevision(selectedRevision?.id === revision.id ? null : revision)}
                                                              >
                                                              <div className="flex items-start justify-between">
                                                                                <div className="flex-1">
                                                                                                    <div className="flex items-center gap-3 mb-2">
                                                                                                                          <h3 className="text-lg font-semibold text-white">
                                                                                                                                                  v{revision.versionNumber}: {revision.documentTitle}
                                                                                                                            </h3>h3>
                                                                                                                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 ${getStatusColor(revision.status)}`}>
                                                                                                                                                  <span>{getStatusIcon(revision.status)}</span>span>
                                                                                                                                                  <span className="capitalize">{revision.status.replace(/_/g, ' ')}</span>span>
                                                                                                                            </span>span>
                                                                                                      </div>div>
                                                                                
                                                                                                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-3">
                                                                                                                          <span>Created: {new Date(revision.createdAt).toLocaleDateString()}</span>span>
                                                                                                                          <span>By: {revision.createdBy.name}</span>span>
                                                                                                                          <span>Size: {formatFileSize(revision.fileSize)}</span>span>
                                                                                                      </div>div>
                                                                                
                                                                                  {/* Changes Summary */}
                                                                                                    <div className="flex gap-4 text-sm">
                                                                                                                          <div className="flex items-center gap-2">
                                                                                                                                                  <span className="text-green-400 font-semibold">+{revision.changes.added}</span>span>
                                                                                                                                                  <span className="text-slate-500">added</span>span>
                                                                                                                            </div>div>
                                                                                                                          <div className="flex items-center gap-2">
                                                                                                                                                  <span className="text-blue-400 font-semibold">~{revision.changes.modified}</span>span>
                                                                                                                                                  <span className="text-slate-500">modified</span>span>
                                                                                                                            </div>div>
                                                                                                                          <div className="flex items-center gap-2">
                                                                                                                                                  <span className="text-red-400 font-semibold">-{revision.changes.deleted}</span>span>
                                                                                                                                                  <span className="text-slate-500">deleted</span>span>
                                                                                                                            </div>div>
                                                                                                      </div>div>
                                                                                </div>div>
                                                              
                                                                {/* Review Status */}
                                                                {revision.reviewStatus && (
                                                                                    <div className="flex gap-3 ml-4">
                                                                                                          <div className="text-right">
                                                                                                                                  <p className="text-green-400 font-semibold text-sm">{revision.reviewStatus.approved}</p>p>
                                                                                                                                  <p className="text-slate-500 text-xs">Approved</p>p>
                                                                                                            </div>div>
                                                                                                          <div className="text-right">
                                                                                                                                  <p className="text-yellow-400 font-semibold text-sm">{revision.reviewStatus.pending}</p>p>
                                                                                                                                  <p className="text-slate-500 text-xs">Pending</p>p>
                                                                                                            </div>div>
                                                                                                          <div className="text-right">
                                                                                                                                  <p className="text-red-400 font-semibold text-sm">{revision.reviewStatus.rejected}</p>p>
                                                                                                                                  <p className="text-slate-500 text-xs">Rejected</p>p>
                                                                                                            </div>div>
                                                                                      </div>div>
                                                                                )}
                                                              </div>div>
                                              
                                                {/* Expanded Details */}
                                                {selectedRevision?.id === revision.id && (
                                                                                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                                                                                                      <div className="grid grid-cols-2 gap-4">
                                                                                                                            <div>
                                                                                                                                                    <p className="text-slate-400 text-sm">Created By</p>p>
                                                                                                                                                    <p className="text-white font-semibold">{revision.createdBy.name}</p>p>
                                                                                                                                                    <p className="text-slate-400 text-xs">{revision.createdBy.email}</p>p>
                                                                                                                              </div>div>
                                                                                                                            <div>
                                                                                                                                                    <p className="text-slate-400 text-sm">Document ID</p>p>
                                                                                                                                                    <p className="text-white font-semibold text-sm">{revision.documentId}</p>p>
                                                                                                                              </div>div>
                                                                                                        </div>div>
                                                                                  
                                                                                                      <div className="flex gap-2">
                                                                                                                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                                                                                                                                    View Full Diff
                                                                                                                              </Button>Button>
                                                                                                                            <Button className="flex-1 bg-slate-700 hover:bg-slate-600">
                                                                                                                                                    Download Version
                                                                                                                              </Button>Button>
                                                                                                                            <Button variant="secondary">Restore</Button>Button>
                                                                                                        </div>div>
                                                                                    </div>div>
                                                              )}
                                              </div>div>
                                </Card>Card>
                              ))}
                  </div>div>
              )}
        </div>div>
      );
}</div>
