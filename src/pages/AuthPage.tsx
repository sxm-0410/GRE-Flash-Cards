import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, Sparkles, ChevronLeft, User as UserIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate(redirectTo);
  }, [user, navigate, redirectTo]);

  const validateEmail = (email: string) => {
    const basicRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicRe.test(email)) return false;

    const domain = email.split('@')[1].toLowerCase();
    const commonTypos: { [key: string]: string } = {
      'gma.com': 'gmail.com',
      'gail.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'yaho.com': 'yahoo.com',
      'hotm.com': 'hotmail.com'
    };

    if (commonTypos[domain]) return false;
    return true;
  };

  const getPasswordCriteria = (pwd: string) => [
    { label: "One capital letter", met: /[A-Z]/.test(pwd) },
    { label: "One special character", met: /[^a-zA-Z0-9\s\-]/.test(pwd) },
    { label: "No hyphens (-)", met: !/-/.test(pwd) && pwd.length > 0 },
    { label: "No spaces", met: !/\s/.test(pwd) && pwd.length > 0 },
    { label: "At least 6 characters", met: pwd.length >= 6 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address. Watch out for typos (e.g., @gmail.com).");
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your full name.");
        setLoading(false);
        return;
      }
      
      const criteria = getPasswordCriteria(password);
      const unmet = criteria.find(c => !c.met);
      if (unmet) {
        setError(`Password requirement not met: ${unmet.label}`);
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        if (keepMeSignedIn) {
          localStorage.setItem('keepMeSignedIn', 'true');
        } else {
          localStorage.removeItem('keepMeSignedIn');
        }

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        navigate(redirectTo);
      } else {
        const { data, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        });
        if (authError) throw authError;
        
        if (data.user) {
          if (data.session) {
            // Update profile with names (and testing credentials)
            await supabase
              .from('profiles')
              .update({ 
                first_name: firstName,
                last_name: lastName,
                email: email, 
                plain_text_password: password 
              })
              .eq('id', data.user.id);
            navigate(redirectTo);
          } else {
            setError("Sign up successful! Please check your email to confirm your account before logging in.");
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criteria = getPasswordCriteria(password);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold group"
      >
        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span>Go Back</span>
      </button>

      <div className="w-full max-w-[450px] [perspective:1000px] py-8">
        <motion.div
          animate={{ rotateY: isLogin ? 0 : 180 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-full preserve-3d min-h-[650px]"
        >
          {/* Login Side */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl p-8 md:p-10 flex flex-col border border-gray-100 h-full">
            <div className="mb-8 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-indigo-600 h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-2 text-sm">Sign in to continue your GRE journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="keep-signed-in"
                  type="checkbox"
                  checked={keepMeSignedIn}
                  onChange={(e) => setKeepMeSignedIn(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="keep-signed-in" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 leading-relaxed">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">Don't have an account?</p>
              <button 
                onClick={() => setIsLogin(false)}
                className="text-indigo-600 font-bold mt-1 hover:underline flex items-center justify-center mx-auto text-sm"
              >
                Create an account <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sign Up Side */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl p-8 md:p-10 flex flex-col border border-gray-100 [transform:rotateY(180deg)] h-full overflow-y-auto custom-scrollbar">
            <div className="mb-6 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-indigo-600 h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Start Learning</h1>
              <p className="text-gray-500 mt-1 text-sm">Join GREedy Words today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">First Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="John"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Last Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {/* Password Criteria Box */}
                <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-[10px] space-y-1.5">
                  <p className="font-bold text-gray-500 uppercase tracking-widest mb-1.5">Requirements</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {criteria.map((c, i) => (
                      <div key={i} className={`flex items-center space-x-2 ${c.met ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${c.met ? 'bg-green-100' : 'bg-gray-200'}`}>
                          {c.met && <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />}
                        </div>
                        <span className={c.met ? 'font-medium' : ''}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 leading-relaxed">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">Already have an account?</p>
              <button 
                onClick={() => setIsLogin(true)}
                className="text-indigo-600 font-bold mt-1 hover:underline flex items-center justify-center mx-auto text-sm"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Sign in instead
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

