'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
        }

        if (password.length < 8) {
                setError('Password must be at least 8 characters');
                return;
        }

        setLoading(true);
        try {
                await signUp(email, password);
                router.push('/dashboard');
        } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to sign up');
        } finally {
                setLoading(false);
        }
  };

  const handleGoogleSignUp = async () => {
        setError('');
        setLoading(true);
        try {
                await signInWithGoogle();
        } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
        } finally {
                setLoading(false);
        }
  };

  return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                      <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
                                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>h1>
                                <p className="text-slate-400 mb-8">Join ClientFlow to manage your design projects</p>p>
                      
                        {error && (
                      <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
                        {error}
                      </div>div>
                                )}
                      
                                <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                          <label className="block text-sm font-medium text-slate-300 mb-1">
                                                                          Email Address
                                                          </label>label>
                                                          <input
                                                                            type="email"
                                                                            value={email}
                                                                            onChange={(e) => setEmail(e.target.value)}
                                                                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                                                                            placeholder="you@example.com"
                                                                            required
                                                                          />
                                            </div>div>
                                
                                            <div>
                                                          <label className="block text-sm font-medium text-slate-300 mb-1">
                                                                          Password
                                                          </label>label>
                                                          <div className="relative">
                                                                          <input
                                                                                              type={showPassword ? 'text' : 'password'}
                                                                                              value={password}
                                                                                              onChange={(e) => setPassword(e.target.value)}
                                                                                              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                                                                                              placeholder="••••••••"
                                                                                              required
                                                                                            />
                                                                          <button
                                                                                              type="button"
                                                                                              onClick={() => setShowPassword(!showPassword)}
                                                                                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                                                                                            >
                                                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                                                          </button>button>
                                                          </div>div>
                                            </div>div>
                                
                                            <div>
                                                          <label className="block text-sm font-medium text-slate-300 mb-1">
                                                                          Confirm Password
                                                          </label>label>
                                                          <input
                                                                            type="password"
                                                                            value={confirmPassword}
                                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                                                                            placeholder="••••••••"
                                                                            required
                                                                          />
                                            </div>div>
                                
                                            <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-medium py-2 rounded transition mt-6"
                                                          >
                                              {loading ? 'Creating account...' : 'Create Account'}
                                            </button>button>
                                </form>form>
                      
                                <div className="mt-6">
                                            <div className="relative">
                                                          <div className="absolute inset-0 flex items-center">
                                                                          <div className="w-full border-t border-slate-600"></div>div>
                                                          </div>div>
                                                          <div className="relative flex justify-center text-sm">
                                                                          <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>span>
                                                          </div>div>
                                            </div>div>
                                
                                            <button
                                                            onClick={handleGoogleSignUp}
                                                            disabled={loading}
                                                            className="w-full mt-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white font-medium py-2 rounded border border-slate-600 transition flex items-center justify-center gap-2"
                                                          >
                                                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                                          </svg>svg>
                                                          Google
                                            </button>button>
                                </div>div>
                      
                                <p className="text-center text-slate-400 text-sm mt-6">
                                            Already have an account?{' '}
                                            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
                                                          Sign in
                                            </Link>Link>
                                </p>p>
                      </div>div>
              </div>div>
        </div>div>
      );
}</div>
