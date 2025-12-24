'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Project {
    id: string;
    name: string;
    clientName: string;
    status: 'planning' | 'in_progress' | 'review' | 'approved' | 'completed';
    progress: number;
    dueDate: string;
    questionsAnswered: number;
    totalQuestions: number;
    documentStatus: 'pending' | 'generated' | 'approved' | 'revised';
    createdAt: string;
}

const statusColors = {
    planning: 'bg-slate-700 text-slate-200',
    in_progress: 'bg-blue-700 text-blue-200',
    review: 'bg-yellow-700 text-yellow-200',
    approved: 'bg-green-700 text-green-200',
    completed: 'bg-indigo-700 text-indigo-200',
};

const docStatusColors = {
    pending: 'bg-slate-700 text-slate-200',
    generated: 'bg-blue-700 text-blue-200',
    approved: 'bg-green-700 text-green-200',
    revised: 'bg-yellow-700 text-yellow-200',
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<'recent' | 'due' | 'progress'>('recent');

  useEffect(() => {
        fetchProjects();
  }, []);

  const fetchProjects = async () => {
        try {
                setLoading(true);
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data.projects || []);
        } catch (error) {
                console.error('Error fetching projects:', error);
                // Mock data for demo
          setProjects([
            {
                        id: '1',
                        name: 'Website Redesign',
                        clientName: 'Tech Startup Inc.',
                        status: 'in_progress',
                        progress: 65,
                        dueDate: '2025-02-15',
                        questionsAnswered: 8,
                        totalQuestions: 12,
                        documentStatus: 'approved',
                        createdAt: '2025-01-10',
            },
            {
                        id: '2',
                        name: 'Mobile App MVP',
                        clientName: 'Creative Agency Ltd.',
                        status: 'planning',
                        progress: 25,
                        dueDate: '2025-03-20',
                        questionsAnswered: 3,
                        totalQuestions: 12,
                        documentStatus: 'pending',
                        createdAt: '2025-01-15',
            },
                  ]);
        } finally {
                setLoading(false);
        }
  };

  const filteredProjects = projects
      .filter((p) => {
              const matchesSearch =
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesStatus = !statusFilter || p.status === statusFilter;
              return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
              switch (sortBy) {
                case 'due':
                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                case 'progress':
                            return b.progress - a.progress;
                case 'recent':
                default:
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              }
      });

  return (
        <div className="space-y-6">
          {/* Header */}
              <div>
                      <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>h1>
                      <p className="text-slate-400">Manage and track all your client projects</p>p>
              </div>div>
        
          {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                                <div>
                                            <p className="text-slate-400 text-sm">Total Projects</p>p>
                                            <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>p>
                                </div>div>
                      </Card>Card>
                      <Card>
                                <div>
                                            <p className="text-slate-400 text-sm">In Progress</p>p>
                                            <p className="text-3xl font-bold text-blue-400 mt-1">
                                              {projects.filter((p) => p.status === 'in_progress').length}
                                            </p>p>
                                </div>div>
                      </Card>Card>
                      <Card>
                                <div>
                                            <p className="text-slate-400 text-sm">Pending Review</p>p>
                                            <p className="text-3xl font-bold text-yellow-400 mt-1">
                                              {projects.filter((p) => p.status === 'review').length}
                                            </p>p>
                                </div>div>
                      </Card>Card>
                      <Card>
                                <div>
                                            <p className="text-slate-400 text-sm">Completed</p>p>
                                            <p className="text-3xl font-bold text-green-400 mt-1">
                                              {projects.filter((p) => p.status === 'completed').length}
                                            </p>p>
                                </div>div>
                      </Card>Card>
              </div>div>
        
          {/* Filters */}
              <Card>
                      <div className="space-y-4">
                                <Input
                                              label="Search Projects"
                                              value={searchQuery}
                                              onChange={(e) => setSearchQuery(e.target.value)}
                                              placeholder="Search by name or client..."
                                            />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                          <label className="block text-sm font-medium text-slate-300 mb-2">
                                                                          Filter by Status
                                                          </label>label>
                                                          <select
                                                                            value={statusFilter}
                                                                            onChange={(e) => setStatusFilter(e.target.value)}
                                                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                                                                          >
                                                                          <option value="">All Statuses</option>option>
                                                                          <option value="planning">Planning</option>option>
                                                                          <option value="in_progress">In Progress</option>option>
                                                                          <option value="review">Pending Review</option>option>
                                                                          <option value="approved">Approved</option>option>
                                                                          <option value="completed">Completed</option>option>
                                                          </select>select>
                                            </div>div>
                                            <div>
                                                          <label className="block text-sm font-medium text-slate-300 mb-2">
                                                                          Sort by
                                                          </label>label>
                                                          <select
                                                                            value={sortBy}
                                                                            onChange={(e) => setSortBy(e.target.value as any)}
                                                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                                                                          >
                                                                          <option value="recent">Most Recent</option>option>
                                                                          <option value="due">Due Date</option>option>
                                                                          <option value="progress">Progress</option>option>
                                                          </select>select>
                                            </div>div>
                                </div>div>
                      </div>div>
              </Card>Card>
        
          {/* Projects List */}
          {loading ? (
                  <Card>
                            <p className="text-slate-400">Loading projects...</p>p>
                  </Card>Card>
                ) : filteredProjects.length === 0 ? (
                  <Card>
                            <p className="text-slate-400 text-center py-8">No projects found</p>p>
                  </Card>Card>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                                <Card key={project.id}>
                                              <div className="space-y-4">
                                                {/* Header */}
                                                              <div className="flex items-start justify-between">
                                                                                <div>
                                                                                                    <h3 className="text-xl font-semibold text-white">{project.name}</h3>h3>
                                                                                                    <p className="text-sm text-slate-400 mt-1">{project.clientName}</p>p>
                                                                                </div>div>
                                                                                <div className="flex gap-2">
                                                                                                    <span className={`px-3 py-1 rounded text-xs font-medium ${statusColors[project.status]}`}>
                                                                                                      {project.status.replace('_', ' ')}
                                                                                                      </span>span>
                                                                                                    <span className={`px-3 py-1 rounded text-xs font-medium ${docStatusColors[project.documentStatus]}`}>
                                                                                                                          Doc: {project.documentStatus}
                                                                                                      </span>span>
                                                                                </div>div>
                                                              </div>div>
                                              
                                                {/* Progress */}
                                                              <div>
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                                    <span className="text-sm text-slate-400">Progress</span>span>
                                                                                                    <span className="text-sm font-semibold text-white">{project.progress}%</span>span>
                                                                                </div>div>
                                                                                <div className="w-full bg-slate-700 rounded-full h-2">
                                                                                                    <div
                                                                                                                            className="bg-indigo-600 h-2 rounded-full transition-all"
                                                                                                                            style={{ width: `${project.progress}%` }}
                                                                                                                          />
                                                                                </div>div>
                                                              </div>div>
                                              
                                                {/* Questions Progress */}
                                                              <div className="bg-slate-800 p-3 rounded flex items-center justify-between">
                                                                                <div>
                                                                                                    <p className="text-sm font-medium text-slate-300">Questionnaire Progress</p>p>
                                                                                                    <p className="text-xs text-slate-500 mt-1">
                                                                                                      {project.questionsAnswered} of {project.totalQuestions} questions answered
                                                                                                      </p>p>
                                                                                </div>div>
                                                                                <span className="text-lg font-semibold text-indigo-400">
                                                                                  {Math.round((project.questionsAnswered / project.totalQuestions) * 100)}%
                                                                                </span>span>
                                                              </div>div>
                                              
                                                {/* Footer */}
                                                              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                                                                                <p className="text-xs text-slate-500">
                                                                                                    Due: {new Date(project.dueDate).toLocaleDateString()}
                                                                                </p>p>
                                                                                <div className="flex gap-2">
                                                                                                    <Button variant="ghost" size="sm">
                                                                                                                          View Details
                                                                                                      </Button>Button>
                                                                                                    <Button size="sm">
                                                                                                                          Continue
                                                                                                      </Button>Button>
                                                                                </div>div>
                                                              </div>div>
                                              </div>div>
                                </Card>Card>
                              ))}
                  </div>div>
              )}
        </div>div>
      );
}</div>
