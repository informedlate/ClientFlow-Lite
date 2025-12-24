'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface MetricCard {
    title: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    icon: string;
}

export default function AnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30days');
    const [metrics, setMetrics] = useState<MetricCard[]>([]);

  useEffect(() => {
        const loadAnalytics = async () => {
                try {
                          setIsLoading(true);
                          // Mock data - replace with actual analytics API call
                  const mockMetrics: MetricCard[] = [
                    {
                                  title: 'Total Projects',
                                  value: 24,
                                  change: 12.5,
                                  trend: 'up',
                                  icon: '📊'
                    },
                    {
                                  title: 'Active Users',
                                  value: 156,
                                  change: 8.2,
                                  trend: 'up',
                                  icon: '👥'
                    },
                    {
                                  title: 'Completed Questionnaires',
                                  value: 89,
                                  change: -3.1,
                                  trend: 'down',
                                  icon: '✓'
                    },
                    {
                                  title: 'Generated Documents',
                                  value: 156,
                                  change: 15.3,
                                  trend: 'up',
                                  icon: '📄'
                    },
                    {
                                  title: 'Revenue',
                                  value: '$45,230',
                                  change: 22.7,
                                  trend: 'up',
                                  icon: '💰'
                    },
                    {
                                  title: 'Conversion Rate',
                                  value: '68%',
                                  change: 5.2,
                                  trend: 'up',
                                  icon: '📈'
                    }
                            ];
                          setMetrics(mockMetrics);
                } catch (error) {
                          console.error('Failed to load analytics:', error);
                } finally {
                          setIsLoading(false);
                }
        };

                loadAnalytics();
  }, [dateRange]);

  const getTrendColor = (trend: string): string => {
        switch (trend) {
          case 'up':
                    return 'text-green-400';
          case 'down':
                    return 'text-red-400';
          default:
                    return 'text-slate-400';
        }
  };

  const getTrendIcon = (trend: string): string => {
        switch (trend) {
          case 'up':
                    return '↑';
          case 'down':
                    return '↓';
          default:
                    return '→';
        }
  };

  return (
        <div className="space-y-6">
          {/* Header */}
              <div>
                      <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>h1>
                      <p className="text-slate-400">Real-time insights and performance metrics</p>p>
              </div>div>
        
          {/* Date Range Selector */}
              <div className="flex gap-2">
                {['7days', '30days', '90days', 'lifetime'].map((range) => (
                    <Button
                                  key={range}
                                  onClick={() => setDateRange(range)}
                                  className={`text-sm ${
                                                  dateRange === range
                                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                                    : 'bg-slate-700 hover:bg-slate-600'
                                  }`}
                                >
                      {range === '7days'
                                      ? '7 Days'
                                      : range === '30days'
                                      ? '30 Days'
                                      : range === '90days'
                                      ? '90 Days'
                                      : 'Lifetime'}
                    </Button>Button>
                  ))}
              </div>div>
        
          {/* Metrics Grid */}
          {isLoading ? (
                  <div className="text-center text-slate-400 py-12">
                            <p>Loading analytics...</p>p>
                  </div>div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {metrics.map((metric, index) => (
                                <Card key={index}>
                                              <div className="p-6">
                                                              <div className="flex items-start justify-between mb-4">
                                                                                <div>
                                                                                                    <p className="text-slate-400 text-sm mb-1">{metric.title}</p>p>
                                                                                                    <p className="text-2xl font-bold text-white">{metric.value}</p>p>
                                                                                </div>div>
                                                                                <span className="text-3xl">{metric.icon}</span>span>
                                                              </div>div>
                                              
                                                              <div className="flex items-center gap-2">
                                                                                <span className={`text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                                                                                  {getTrendIcon(metric.trend)} {Math.abs(metric.change)}%
                                                                                </span>span>
                                                                                <span className="text-slate-500 text-sm">
                                                                                                    from last period
                                                                                </span>span>
                                                              </div>div>
                                              </div>div>
                                </Card>Card>
                              ))}
                  </div>div>
              )}
        
          {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Status Chart */}
                      <Card>
                                <div className="p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">
                                                          Projects by Status
                                            </h3>h3>
                                            <div className="space-y-3">
                                              {[
          { status: 'Planning', count: 5, percentage: 21, color: 'bg-blue-600' },
          { status: 'In Progress', count: 8, percentage: 33, color: 'bg-yellow-600' },
          { status: 'In Review', count: 6, percentage: 25, color: 'bg-purple-600' },
          { status: 'Completed', count: 5, percentage: 21, color: 'bg-green-600' }
                        ].map((item, idx) => (
                                          <div key={idx}>
                                                            <div className="flex justify-between mb-1">
                                                                                <span className="text-slate-300 text-sm">{item.status}</span>span>
                                                                                <span className="text-slate-400 text-sm">{item.count}</span>span>
                                                            </div>div>
                                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                                                <div
                                                                                                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                                                                                        style={{ width: `${item.percentage}%` }}
                                                                                                      />
                                                            </div>div>
                                          </div>div>
                                        ))}
                                            </div>div>
                                </div>div>
                      </Card>Card>
              
                {/* Response Quality Chart */}
                      <Card>
                                <div className="p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">
                                                          Response Quality Metrics
                                            </h3>h3>
                                            <div className="space-y-3">
                                              {[
          { metric: 'Completion Rate', value: 89, color: 'bg-green-600' },
          { metric: 'Data Quality', value: 92, color: 'bg-blue-600' },
          { metric: 'User Satisfaction', value: 85, color: 'bg-purple-600' },
          { metric: 'Response Time', value: 78, color: 'bg-orange-600' }
                        ].map((item, idx) => (
                                          <div key={idx}>
                                                            <div className="flex justify-between mb-1">
                                                                                <span className="text-slate-300 text-sm">{item.metric}</span>span>
                                                                                <span className="text-slate-400 text-sm">{item.value}%</span>span>
                                                            </div>div>
                                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                                                <div
                                                                                                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                                                                                        style={{ width: `${item.value}%` }}
                                                                                                      />
                                                            </div>div>
                                          </div>div>
                                        ))}
                                            </div>div>
                                </div>div>
                      </Card>Card>
              </div>div>
        
          {/* Actions */}
              <div className="flex gap-2">
                      <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                Export Report
                      </Button>Button>
                      <Button className="flex-1 bg-slate-700 hover:bg-slate-600">
                                Schedule Report
                      </Button>Button>
              </div>div>
        </div>div>
      );
}</div>
