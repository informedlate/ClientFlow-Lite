import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
    const { user } = useAuth();

  return (
        <div className="space-y-8">
          {/* Welcome Section */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                      <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>h1>
                      <p className="text-indigo-100">
                        {user?.email ? `You're logged in as ${user.email}` : 'Ready to manage your clients?'}
                      </p>p>
              </div>div>
        
          {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                            <div>
                                                          <p className="text-slate-400 text-sm">Total Clients</p>p>
                                                          <p className="text-3xl font-bold text-white mt-2">0</p>p>
                                            </div>div>
                                            <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                                                          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                          </svg>svg>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                            <div>
                                                          <p className="text-slate-400 text-sm">Active Projects</p>p>
                                                          <p className="text-3xl font-bold text-white mt-2">0</p>p>
                                            </div>div>
                                            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                                                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                          </svg>svg>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                            <div>
                                                          <p className="text-slate-400 text-sm">Documents</p>p>
                                                          <p className="text-3xl font-bold text-white mt-2">0</p>p>
                                            </div>div>
                                            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                          </svg>svg>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                            <div>
                                                          <p className="text-slate-400 text-sm">Revenue</p>p>
                                                          <p className="text-3xl font-bold text-white mt-2">$0</p>p>
                                            </div>div>
                                            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                          </svg>svg>
                                            </div>div>
                                </div>div>
                      </div>div>
              </div>div>
        
          {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Recent Clients</h2>h2>
                                <div className="space-y-4">
                                            <p className="text-slate-400 text-sm">No clients yet. <a href="/dashboard/clients" className="text-indigo-400 hover:text-indigo-300">Add your first client</a>a></p>p>
                                </div>div>
                      </div>div>
              
                      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>h2>
                                <ul className="space-y-3 text-sm">
                                            <li className="flex items-start gap-3">
                                                          <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                          <span className="text-white text-xs font-semibold">✓</span>span>
                                                          </span>span>
                                                          <span className="text-slate-300">Set up your profile</span>span>
                                            </li>li>
                                            <li className="flex items-start gap-3">
                                                          <span className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                          <span className="text-white text-xs font-semibold">2</span>span>
                                                          </span>span>
                                                          <span className="text-slate-400">Add your first client</span>span>
                                            </li>li>
                                            <li className="flex items-start gap-3">
                                                          <span className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                          <span className="text-white text-xs font-semibold">3</span>span>
                                                          </span>span>
                                                          <span className="text-slate-400">Create a questionnaire</span>span>
                                            </li>li>
                                            <li className="flex items-start gap-3">
                                                          <span className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                          <span className="text-white text-xs font-semibold">4</span>span>
                                                          </span>span>
                                                          <span className="text-slate-400">Generate scope documents</span>span>
                                            </li>li>
                                </ul>ul>
                      </div>div>
              </div>div>
        </div>div>
      );
}</div>
