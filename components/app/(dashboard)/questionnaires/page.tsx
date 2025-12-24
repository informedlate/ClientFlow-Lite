'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { QuestionnaireTemplateBuilder } from '@/components/QuestionnaireTemplateBuilder';
import { ClientQuestionnaireForm } from '@/components/ClientQuestionnaireForm';

interface Template {
    id: string;
    name: string;
    description: string;
    projectType: string;
    questionCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function QuestionnairesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [projectTypeFilter, setProjectTypeFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'complete'>('templates');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
        fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
        try {
                setLoading(true);
                const response = await fetch('/api/questionnaires');
                if (!response.ok) throw new Error('Failed to fetch templates');
                const data = await response.json();
                setTemplates(data.templates || []);
        } catch (error) {
                console.error('Error fetching templates:', error);
                setTemplates([]);
        } finally {
                setLoading(false);
        }
  };

  const handleDeleteTemplate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
                const response = await fetch(`/api/questionnaires/${id}`, {
                          method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete template');
                setTemplates(templates.filter((t) => t.id !== id));
        } catch (error) {
                console.error('Error deleting template:', error);
                alert('Failed to delete template');
        }
  };

  const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = !projectTypeFilter || template.projectType === projectTypeFilter;
        return matchesSearch && matchesFilter;
  });

  const projectTypes = Array.from(new Set(templates.map((t) => t.projectType).filter(Boolean)));

  if (activeTab === 'builder') {
        return (
                <div className="space-y-4">
                        <div className="flex items-center justify-between">
                                  <h1 className="text-3xl font-bold text-white">Create New Template</h1>h1>
                                  <Button
                                                variant="ghost"
                                                onClick={() => {
                                                                setActiveTab('templates');
                                                                fetchTemplates();
                                                }}
                                              >
                                              ← Back to Templates
                                  </Button>Button>
                        </div>div>
                        <QuestionnaireTemplateBuilder />
                </div>div>
              );
  }
  
    if (activeTab === 'complete' && selectedTemplate) {
          return (
                  <div className="space-y-4">
                          <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-bold text-white">
                                                Complete: {selectedTemplate.name}
                                    </h1>h1>
                                    <Button
                                                  variant="ghost"
                                                  onClick={() => {
                                                                  setActiveTab('templates');
                                                                  setSelectedTemplate(null);
                                                  }}
                                                >
                                                ← Back to Templates
                                    </Button>Button>
                          </div>div>
                          <ClientQuestionnaireForm templateId={selectedTemplate.id} />
                  </div>div>
                );
    }
  
    return (
          <div className="space-y-6">
                <div className="flex items-center justify-between">
                        <div>
                                  <h1 className="text-3xl font-bold text-white">Questionnaire Templates</h1>h1>
                                  <p className="text-slate-400 mt-1">
                                              Create and manage questionnaire templates for your projects
                                  </p>p>
                        </div>div>
                        <Button
                                    onClick={() => setActiveTab('builder')}
                                    className="flex items-center gap-2"
                                  >
                                  + Create Template
                        </Button>Button>
                </div>div>
          
                <Card>
                        <div className="space-y-4">
                                  <h2 className="text-xl font-semibold text-white">Search & Filter</h2>h2>
                        
                                  <Input
                                                label="Search Templates"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search by name or description..."
                                              />
                        
                          {projectTypes.length > 0 && (
                        <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">
                                                      Filter by Project Type
                                      </label>label>
                                      <select
                                                        value={projectTypeFilter}
                                                        onChange={(e) => setProjectTypeFilter(e.target.value)}
                                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                                                      >
                                                      <option value="">All Project Types</option>option>
                                        {projectTypes.map((type) => (
                                                                          <option key={type} value={type}>
                                                                            {type}
                                                                          </option>option>
                                                                        ))}
                                      </select>select>
                        </div>div>
                                  )}
                        </div>div>
                </Card>Card>
          
            {loading ? (
                    <Card>
                              <div className="text-center py-8">
                                          <p className="text-slate-400">Loading templates...</p>p>
                              </div>div>
                    </Card>Card>
                  ) : filteredTemplates.length === 0 ? (
                    <Card>
                              <div className="text-center py-8">
                                          <p className="text-slate-400 mb-4">
                                            {templates.length === 0
                                                              ? 'No templates created yet. Create your first template to get started.'
                                                              : 'No templates match your search criteria.'}
                                          </p>p>
                                {templates.length === 0 && (
                                    <Button onClick={() => setActiveTab('builder')}>
                                                    + Create First Template
                                    </Button>Button>
                                          )}
                              </div>div>
                    </Card>Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTemplates.map((template) => (
                                  <Card key={template.id}>
                                                <div className="space-y-3">
                                                                <div>
                                                                                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>h3>
                                                                                  <p className="text-sm text-slate-400 mt-1">{template.description}</p>p>
                                                                                  <div className="flex items-center gap-2 mt-2">
                                                                                                      <span className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded">
                                                                                                        {template.projectType}
                                                                                                        </span>span>
                                                                                                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                                                                                        {template.questionCount} questions
                                                                                                        </span>span>
                                                                                    </div>div>
                                                                </div>div>
                                                
                                                                <div className="border-t border-slate-700 pt-3">
                                                                                  <p className="text-xs text-slate-500 mb-3">
                                                                                                      Updated {new Date(template.updatedAt).toLocaleDateString()}
                                                                                    </p>p>
                                                                
                                                                                  <div className="grid grid-cols-2 gap-2">
                                                                                                      <Button
                                                                                                                              onClick={() => {
                                                                                                                                                        setSelectedTemplate(template);
                                                                                                                                                        setActiveTab('complete');
                                                                                                                                }}
                                                                                                                              size="sm"
                                                                                                                            >
                                                                                                                            Use
                                                                                                        </Button>Button>
                                                                                  
                                                                                                      <Button
                                                                                                                              variant="secondary"
                                                                                                                              size="sm"
                                                                                                                              onClick={() => alert('Edit functionality coming soon')}
                                                                                                                            >
                                                                                                                            Edit
                                                                                                        </Button>Button>
                                                                                  
                                                                                                      <Button
                                                                                                                              variant="danger"
                                                                                                                              size="sm"
                                                                                                                              onClick={() => handleDeleteTemplate(template.id)}
                                                                                                                              className="col-span-2"
                                                                                                                            >
                                                                                                                            Delete
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
