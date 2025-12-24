'use client';

import { QuestionnaireResponse, QuestionnaireTemplate } from '@/lib/types/questionnaire';
import { Card, CardBody, CardHeader } from './Card';
import { Badge } from './Badge';

interface QuestionnaireResponseViewerProps {
    response: QuestionnaireResponse;
    template: QuestionnaireTemplate;
    showAnalysis?: boolean;
}

export function QuestionnaireResponseViewer({
    response,
    template,
    showAnalysis = true,
}: QuestionnaireResponseViewerProps) {
    // Find answer for each question
  const getAnswerForQuestion = (questionId: string) => {
        return response.answers.find(a => a.questionId === questionId);
  };

  // Format answer based on type
  const formatAnswer = (answer: any, type: string) => {
        if (!answer) return <span className="text-slate-500 italic">No answer provided</span>span>;
        
        if (Array.isArray(answer)) {
                return (
                          <div className="flex flex-wrap gap-2">
                            {answer.map((item, idx) => (
                                        <Badge key={idx}>{item}</Badge>Badge>
                                      ))}
                          </div>div>
                        );
        }
        
        if (type === 'rating') {
                return (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                        <div
                                                        key={rating}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold ${
                                                                          answer === rating
                                                                            ? 'bg-indigo-600 text-white'
                                                                            : 'bg-slate-800 text-slate-400'
                                                        }`}
                                                      >
                                          {rating}
                                        </div>div>
                                      ))}
                          </div>div>
                        );
        }
        
        return <p className="text-white whitespace-pre-wrap">{answer}</p>p>;
  };
  
    // Group answers by category
    const answersByCategory = template.questions.reduce((acc, question) => {
          const category = question.category;
          if (!acc[category]) {
                  acc[category] = [];
          }
          acc[category].push(question);
          return acc;
    }, {} as Record<string, typeof template.questions>);
  
    // Status badge styling
    const statusStyles = {
          draft: 'bg-yellow-900/20 text-yellow-400 border-yellow-700',
          in_progress: 'bg-blue-900/20 text-blue-400 border-blue-700',
          submitted: 'bg-green-900/20 text-green-400 border-green-700',
          reviewed: 'bg-indigo-900/20 text-indigo-400 border-indigo-700',
    };
  
    return (
          <div className="space-y-6">
            {/* Header */}
                <Card>
                        <CardHeader>
                                  <div className="flex justify-between items-start">
                                              <div>
                                                            <h1 className="text-3xl font-bold text-white mb-2">{template.name}</h1>h1>
                                                            <p className="text-slate-400">Response Summary</p>p>
                                              </div>div>
                                              <div className="text-right">
                                                            <div className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${
                            statusStyles[response.status as keyof typeof statusStyles]
          }`}>
                                                              {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                                                            </div>div>
                                              </div>div>
                                  </div>div>
                        </CardHeader>CardHeader>
                </Card>Card>
          
            {/* Analysis Section */}
            {showAnalysis && response.completenessScore !== undefined && (
                    <Card className="border-2 border-indigo-600/50 bg-indigo-900/10">
                              <CardBody>
                                          <h2 className="text-xl font-bold text-white mb-4">AI Analysis</h2>h2>
                                          <div className="space-y-4">
                                            {/* Completeness Score */}
                                                        <div>
                                                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                                                                          Completeness Score
                                                                        </label>label>
                                                                        <div className="flex items-center gap-3">
                                                                                          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                                                                                                              <div
                                                                                                                                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                                                                                                                                      style={{ width: `${response.completenessScore}%` }}
                                                                                                                                    />
                                                                                            </div>div>
                                                                                          <span className="font-semibold text-white">{response.completenessScore}%</span>span>
                                                                        </div>div>
                                                        </div>div>
                                          
                                            {/* Follow-up Suggestions */}
                                            {response.followUpQuestions && response.followUpQuestions.length > 0 && (
                                      <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                                                            Suggested Follow-up Questions
                                                        </label>label>
                                                        <ul className="space-y-2">
                                                          {response.followUpQuestions.map((question, idx) => (
                                                              <li key={idx} className="text-slate-400">
                                                                                      • {question}
                                                              </li>li>
                                                            ))}
                                                        </ul>ul>
                                      </div>div>
                                                        )}
                                          </div>div>
                              </CardBody>CardBody>
                    </Card>Card>
                )}
          
            {/* Responses by Category */}
            {Object.entries(answersByCategory).map(([category, questions]) => (
                    <Card key={category}>
                              <CardHeader>
                                          <h2 className="text-xl font-bold text-white capitalize">
                                            {category.replace(/_/g, ' ')}
                                          </h2>h2>
                              </CardHeader>CardHeader>
                              <CardBody>
                                          <div className="space-y-6">
                                            {questions.map((question) => {
                                      const answer = getAnswerForQuestion(question.id);
                                      return (
                                                          <div key={question.id}>
                                                                              <label className="block text-sm font-medium text-white mb-3">
                                                                                {question.question}
                                                                              </label>label>
                                                                              <div className="text-slate-300">
                                                                                {formatAnswer(answer?.answer, question.type)}
                                                                              </div>div>
                                                          </div>div>
                                                        );
                    })}
                                          </div>div>
                              </CardBody>CardBody>
                    </Card>Card>
                  ))}
          
            {/* Metadata */}
                <Card className="bg-slate-800/50">
                        <CardBody>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                              <div>
                                                            <p className="text-slate-500">Submitted</p>p>
                                                            <p className="text-white font-medium">
                                                              {response.submittedAt
                                                                                  ? new Date(response.submittedAt).toLocaleDateString()
                                                                                  : 'Not submitted yet'}
                                                            </p>p>
                                              </div>div>
                                              <div>
                                                            <p className="text-slate-500">Status</p>p>
                                                            <p className="text-white font-medium capitalize">{response.status}</p>p>
                                              </div>div>
                                    {response.followUpsSent !== undefined && (
                          <div>
                                          <p className="text-slate-500">Follow-ups Sent</p>p>
                                          <p className="text-white font-medium">{response.followUpsSent}</p>p>
                          </div>div>
                                              )}
                                  </div>div>
                        </CardBody>CardBody>
                </Card>Card>
          </div>div>
        );
}</span>
