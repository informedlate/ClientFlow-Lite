'use client';

import { useState } from 'react';
import { QuestionnaireTemplate, QuestionnaireQuestion } from '@/lib/types/questionnaire';
import { Button } from './Button';
import { Card, CardBody, CardHeader } from './Card';
import { Input } from './Input';

interface ClientQuestionnaireFormProps {
    template: QuestionnaireTemplate;
    clientId: string;
    onSubmit: (answers: Record<string, any>) => Promise<void>;
    isSubmitting?: boolean;
}

export function ClientQuestionnaireForm({
    template,
    clientId,
    onSubmit,
    isSubmitting = false,
}: ClientQuestionnaireFormProps) {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Group questions by category for step-by-step navigation
  const categories = Array.from(new Set(template.questions.map(q => q.category)));
    const questionsByCategory = categories.map(cat =>
          template.questions.filter(q => q.category === cat).sort((a, b) => a.order - b.order)
                                                 );

  const currentQuestions = questionsByCategory[currentStep] || [];
    const progress = ((currentStep + 1) / questionsByCategory.length) * 100;

  const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({
                ...prev,
                [questionId]: value,
        }));
        setError(null);
  };

  const validateCurrentStep = () => {
        for (const question of currentQuestions) {
                if (question.required && !answers[question.id]) {
                          setError(`${question.question} is required`);
                          return false;
                }
        }
        return true;
  };

  const handleNext = () => {
        if (validateCurrentStep()) {
                setCompletedSteps(prev => new Set([...prev, currentStep]));
                setCurrentStep(prev => Math.min(prev + 1, questionsByCategory.length - 1));
        }
  };

  const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateCurrentStep()) {
                try {
                          await onSubmit(answers);
                } catch (err) {
                          setError(err instanceof Error ? err.message : 'Failed to submit questionnaire');
                }
        }
  };

  return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
              <div className="max-w-2xl mx-auto">
                {/* Header */}
                      <Card className="mb-8">
                                <CardHeader>
                                            <h1 className="text-3xl font-bold text-white mb-2">{template.name}</h1>h1>
                                  {template.description && (
                        <p className="text-slate-400">{template.description}</p>p>
                                            )}
                                </CardHeader>CardHeader>
                      </Card>Card>
              
                {/* Progress Bar */}
                      <div className="mb-8">
                                <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-300">
                                                          Step {currentStep + 1} of {questionsByCategory.length}
                                            </span>span>
                                            <span className="text-sm font-medium text-slate-300">
                                              {Math.round(progress)}% Complete
                                            </span>span>
                                </div>div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                            className="h-full bg-indigo-600 transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                          />
                                </div>div>
                      </div>div>
              
                {/* Questions */}
                      <Card className="mb-8">
                                <CardBody>
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                              {error && (
                          <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg">
                            {error}
                          </div>div>
                                                          )}
                                            
                                                          <div className="space-y-6">
                                                            {currentQuestions.map((question) => (
                            <div key={question.id}>
                                                <label className="block text-sm font-medium text-white mb-3">
                                                  {question.question}
                                                  {question.required && <span className="text-red-500 ml-1">*</span>span>}
                                                </label>label>
                            
                              {question.type === 'text' && (
                                                    <input
                                                                              type="text"
                                                                              value={answers[question.id] || ''}
                                                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                                              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                                                              placeholder="Enter your answer"
                                                                            />
                                                  )}
                            
                              {question.type === 'multiline' && (
                                                    <textarea
                                                                              value={answers[question.id] || ''}
                                                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                                              rows={4}
                                                                              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                                                              placeholder="Enter your detailed answer"
                                                                            />
                                                  )}
                            
                              {question.type === 'multiple_choice' && (
                                                    <div className="space-y-2">
                                                      {question.options?.map((option) => (
                                                                                <label key={option} className="flex items-center">
                                                                                                            <input
                                                                                                                                            type="radio"
                                                                                                                                            name={question.id}
                                                                                                                                            value={option}
                                                                                                                                            checked={answers[question.id] === option}
                                                                                                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                                                                                                            className="mr-3 w-4 h-4"
                                                                                                                                          />
                                                                                                            <span className="text-slate-300">{option}</span>span>
                                                                                  </label>label>
                                                                              ))}
                                                    </div>div>
                                                )}
                            
                              {question.type === 'checkbox' && (
                                                    <div className="space-y-2">
                                                      {question.options?.map((option) => (
                                                                                <label key={option} className="flex items-center">
                                                                                                            <input
                                                                                                                                            type="checkbox"
                                                                                                                                            checked={(answers[question.id] || []).includes(option)}
                                                                                                                                            onChange={(e) => {
                                                                                                                                                                              const current = answers[question.id] || [];
                                                                                                                                                                              const updated = e.target.checked
                                                                                                                                                                                                                  ? [...current, option]
                                                                                                                                                                                                                  : current.filter((v: string) => v !== option);
                                                                                                                                                                              handleAnswerChange(question.id, updated);
                                                                                                                                              }}
                                                                                                                                            className="mr-3 w-4 h-4"
                                                                                                                                          />
                                                                                                            <span className="text-slate-300">{option}</span>span>
                                                                                  </label>label>
                                                                              ))}
                                                    </div>div>
                                                )}
                            
                              {question.type === 'rating' && (
                                                    <div className="flex gap-2">
                                                      {[1, 2, 3, 4, 5].map((rating) => (
                                                                                <button
                                                                                                              key={rating}
                                                                                                              type="button"
                                                                                                              onClick={() => handleAnswerChange(question.id, rating)}
                                                                                                              className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                                                                                                                                              answers[question.id] === rating
                                                                                                                                                ? 'bg-indigo-600 text-white'
                                                                                                                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                                                                                }`}
                                                                                                            >
                                                                                  {rating}
                                                                                  </button>button>
                                                                              ))}
                                                    </div>div>
                                                )}
                            </div>div>
                          ))}
                                                          </div>div>
                                            
                                              {/* Navigation Buttons */}
                                                          <div className="flex justify-between gap-4 pt-6">
                                                                          <Button
                                                                                              onClick={handlePrevious}
                                                                                              disabled={currentStep === 0 || isSubmitting}
                                                                                              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                                                                                            >
                                                                                            Previous
                                                                          </Button>Button>
                                                          
                                                            {currentStep === questionsByCategory.length - 1 ? (
                            <Button
                                                  type="submit"
                                                  disabled={isSubmitting}
                                                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                                >
                              {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
                            </Button>Button>
                          ) : (
                            <Button
                                                  onClick={handleNext}
                                                  disabled={isSubmitting}
                                                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                Next
                            </Button>Button>
                                                                          )}
                                                          </div>div>
                                            </form>form>
                                </CardBody>CardBody>
                      </Card>Card>
              
                {/* Completed Steps Indicator */}
                {questionsByCategory.length > 1 && (
                    <div className="flex justify-center gap-2">
                      {questionsByCategory.map((_, index) => (
                                    <div
                                                      key={index}
                                                      className={`h-2 w-8 rounded-full transition-colors ${
                                                                          completedSteps.has(index) ? 'bg-green-600' : 'bg-slate-700'
                                                      }`}
                                                    />
                                  ))}
                    </div>div>
                      )}
              </div>div>
        </div>div>
      );
}</div>
