'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface Question {
    id: string;
    type: 'text' | 'multiline' | 'multiple_choice' | 'checkbox' | 'rating';
    text: string;
    category: 'business_info' | 'project_goals' | 'design_preferences' | 'content' | 'technical';
    required: boolean;
    options?: string[];
    order: number;
}

interface QuestionnaireTemplate {
    name: string;
    description: string;
    projectType: string;
    questions: Question[];
}

export function QuestionnaireTemplateBuilder() {
    const [template, setTemplate] = useState<QuestionnaireTemplate>({
          name: '',
          description: '',
          projectType: '',
          questions: [],
    });

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
        type: 'text',
        category: 'business_info',
        required: false,
        options: [],
  });

  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
    const [newOption, setNewOption] = useState('');

  const categories = [
        'business_info',
        'project_goals',
        'design_preferences',
        'content',
        'technical',
      ];

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'multiline', label: 'Long Text' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'rating', label: 'Rating' },
      ];

  const handleAddQuestion = () => {
        if (!newQuestion.text) return;

        const question: Question = {
                id: `q-${Date.now()}`,
                text: newQuestion.text || '',
                type: (newQuestion.type as Question['type']) || 'text',
                category: (newQuestion.category as Question['category']) || 'business_info',
                required: newQuestion.required || false,
                options: (newQuestion.type === 'multiple_choice' || newQuestion.type === 'checkbox')
                  ? newQuestion.options || []
                          : undefined,
                order: template.questions.length,
        };

        setTemplate({
                ...template,
                questions: [...template.questions, question],
        });

        setNewQuestion({
                type: 'text',
                category: 'business_info',
                required: false,
                options: [],
        });
        setNewOption('');
  };

  const handleDeleteQuestion = (id: string) => {
        const updated = template.questions
          .filter((q) => q.id !== id)
          .map((q, idx) => ({ ...q, order: idx }));

        setTemplate({
                ...template,
                questions: updated,
        });
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        setTemplate({
                ...template,
                questions: template.questions.map((q) =>
                          q.id === id ? { ...q, ...updates } : q
                                                        ),
        });
  };

  const handleAddOption = () => {
        if (!newOption.trim()) return;

        setNewQuestion({
                ...newQuestion,
                options: [...(newQuestion.options || []), newOption],
        });
        setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
        setNewQuestion({
                ...newQuestion,
                options: newQuestion.options?.filter((_, i) => i !== index) || [],
        });
  };

  const handleMoveQuestion = (id: string, direction: 'up' | 'down') => {
        const idx = template.questions.findIndex((q) => q.id === id);
        if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === template.questions.length - 1)) {
                return;
        }

        const newQuestions = [...template.questions];
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        [newQuestions[idx], newQuestions[swapIdx]] = [newQuestions[swapIdx], newQuestions[idx]];

        setTemplate({
                ...template,
                questions: newQuestions.map((q, i) => ({ ...q, order: i })),
        });
  };

  const handleSaveTemplate = async () => {
        if (!template.name || template.questions.length === 0) {
                alert('Please fill in template name and add at least one question');
                return;
        }

        try {
                const response = await fetch('/api/questionnaires', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(template),
                });

          if (!response.ok) throw new Error('Failed to save template');

          alert('Template saved successfully!');
                setTemplate({
                          name: '',
                          description: '',
                          projectType: '',
                          questions: [],
                });
        } catch (error) {
                console.error('Error saving template:', error);
                alert('Failed to save template');
        }
  };

  return (
        <div className="space-y-6">
              <Card>
                      <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">Create Questionnaire Template</h2>h2>
                      
                                <Input
                                              label="Template Name"
                                              value={template.name}
                                              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                                              placeholder="e.g., Website Redesign"
                                            />
                      
                                <Input
                                              label="Description"
                                              value={template.description}
                                              onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                                              placeholder="Brief description of this template"
                                            />
                      
                                <Input
                                              label="Project Type"
                                              value={template.projectType}
                                              onChange={(e) => setTemplate({ ...template, projectType: e.target.value })}
                                              placeholder="e.g., Web Design, Branding, etc."
                                            />
                      </div>div>
              </Card>Card>
        
              <Card>
                      <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white">Add Questions</h3>h3>
                      
                                <div className="space-y-4 border-t border-slate-700 pt-4">
                                            <Input
                                                            label="Question Text"
                                                            value={newQuestion.text || ''}
                                                            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                                            placeholder="Enter your question"
                                                          />
                                
                                            <div className="grid grid-cols-2 gap-4">
                                                          <div>
                                                                          <label className="block text-sm font-medium text-slate-300 mb-1">
                                                                                            Question Type
                                                                          </label>label>
                                                                          <select
                                                                                              value={newQuestion.type || 'text'}
                                                                                              onChange={(e) =>
                                                                                                                    setNewQuestion({
                                                                                                                                            ...newQuestion,
                                                                                                                                            type: e.target.value as Question['type'],
                                                                                                                                            options: (e.target.value === 'multiple_choice' || e.target.value === 'checkbox')
                                                                                                                                                                      ? newQuestion.options || []
                                                                                                                                                                      : undefined,
                                                                                                                      })
                                                                                                }
                                                                                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                                                                                            >
                                                                            {questionTypes.map((t) => (
                                                                                                                  <option key={t.value} value={t.value}>
                                                                                                                    {t.label}
                                                                                                                    </option>option>
                                                                                                                ))}
                                                                          </select>select>
                                                          </div>div>
                                            
                                                          <div>
                                                                          <label className="block text-sm font-medium text-slate-300 mb-1">
                                                                                            Category
                                                                          </label>label>
                                                                          <select
                                                                                              value={newQuestion.category || 'business_info'}
                                                                                              onChange={(e) =>
                                                                                                                    setNewQuestion({
                                                                                                                                            ...newQuestion,
                                                                                                                                            category: e.target.value as Question['category'],
                                                                                                                      })
                                                                                                }
                                                                                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                                                                                            >
                                                                            {categories.map((c) => (
                                                                                                                  <option key={c} value={c}>
                                                                                                                    {c.replace(/_/g, ' ')}
                                                                                                                    </option>option>
                                                                                                                ))}
                                                                          </select>select>
                                                          </div>div>
                                            </div>div>
                                
                                  {(newQuestion.type === 'multiple_choice' || newQuestion.type === 'checkbox') && (
                        <div className="space-y-3 border-l-2 border-indigo-500 pl-4">
                                        <h4 className="text-sm font-medium text-slate-300">Add Options</h4>h4>
                                        <div className="flex gap-2">
                                                          <Input
                                                                                value={newOption}
                                                                                onChange={(e) => setNewOption(e.target.value)}
                                                                                placeholder="Add an option"
                                                                              />
                                                          <Button onClick={handleAddOption} variant="secondary" size="sm">
                                                                              Add
                                                          </Button>Button>
                                        </div>div>
                        
                                        <div className="flex flex-wrap gap-2">
                                          {newQuestion.options?.map((opt, idx) => (
                                              <div key={idx} className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded">
                                                                    <span className="text-sm text-white">{opt}</span>span>
                                                                    <button
                                                                                              onClick={() => handleRemoveOption(idx)}
                                                                                              className="text-slate-400 hover:text-red-500 ml-2"
                                                                                            >
                                                                                            ✕
                                                                    </button>button>
                                              </div>div>
                                            ))}
                                        </div>div>
                        </div>div>
                                            )}
                                
                                            <label className="flex items-center gap-2">
                                                          <input
                                                                            type="checkbox"
                                                                            checked={newQuestion.required || false}
                                                                            onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                                                                            className="rounded border-slate-600 text-indigo-600"
                                                                          />
                                                          <span className="text-sm text-slate-300">Required</span>span>
                                            </label>label>
                                
                                            <Button onClick={handleAddQuestion} className="w-full">
                                                          Add Question
                                            </Button>Button>
                                </div>div>
                      </div>div>
              </Card>Card>
        
          {template.questions.length > 0 && (
                  <Card>
                            <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-white">
                                                      Questions ({template.questions.length})
                                        </h3>h3>
                            
                                        <div className="space-y-3 border-t border-slate-700 pt-4">
                                          {template.questions.map((question, idx) => (
                                    <div key={question.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                                                      <div className="flex items-start justify-between">
                                                                          <div className="flex-1">
                                                                                                <div className="flex items-center gap-2">
                                                                                                                        <span className="text-sm font-medium text-indigo-400">Q{idx + 1}</span>span>
                                                                                                                        <p className="text-white">{question.text}</p>p>
                                                                                                  {question.required && (
                                                                <span className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded">
                                                                                            Required
                                                                </span>span>
                                                                                                                        )}
                                                                                                  </div>div>
                                                                                                <p className="text-xs text-slate-400 mt-1">
                                                                                                                        Type: {question.type} | Category: {question.category}
                                                                                                  </p>p>
                                                                            {question.options && question.options.length > 0 && (
                                                              <p className="text-xs text-slate-400 mt-1">
                                                                                        Options: {question.options.join(', ')}
                                                              </p>p>
                                                                                                )}
                                                                          </div>div>
                                                      
                                                                          <div className="flex gap-2">
                                                                                                <Button
                                                                                                                          onClick={() => handleMoveQuestion(question.id, 'up')}
                                                                                                                          variant="ghost"
                                                                                                                          size="sm"
                                                                                                                          disabled={idx === 0}
                                                                                                                        >
                                                                                                                        ↑
                                                                                                  </Button>Button>
                                                                                                <Button
                                                                                                                          onClick={() => handleMoveQuestion(question.id, 'down')}
                                                                                                                          variant="ghost"
                                                                                                                          size="sm"
                                                                                                                          disabled={idx === template.questions.length - 1}
                                                                                                                        >
                                                                                                                        ↓
                                                                                                  </Button>Button>
                                                                                                <Button
                                                                                                                          onClick={() => handleDeleteQuestion(question.id)}
                                                                                                                          variant="danger"
                                                                                                                          size="sm"
                                                                                                                        >
                                                                                                                        Delete
                                                                                                  </Button>Button>
                                                                          </div>div>
                                                      </div>div>
                                    </div>div>
                                  ))}
                                        </div>div>
                            </div>div>
                  </Card>Card>
              )}
        
              <div className="flex gap-3">
                      <Button onClick={handleSaveTemplate} className="flex-1">
                                Save Template
                      </Button>Button>
                      <Button
                                  variant="ghost"
                                  onClick={() =>
                                                setTemplate({
                                                                name: '',
                                                                description: '',
                                                                projectType: '',
                                                                questions: [],
                                                })
                                  }
                                  className="flex-1"
                                >
                                Clear All
                      </Button>Button>
              </div>div>
        </div>div>
      );
}</div>
