import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setAccessToken(data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-near-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 space-y-4">
          <div className="w-16 h-16 bg-brand-red rounded-3xl mx-auto flex items-center justify-center font-bold text-3xl text-white shadow-2xl shadow-brand-red/20 mb-6 active:scale-95 transition-transform">
            C
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Consult Practice</h1>
          <p className="text-white/40 font-medium">Platform for future lead consultants</p>
        </div>

        <div className="bg-dark-card border border-white/5 rounded-[40px] p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-white font-medium"
                  placeholder="admin@consult.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 px-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-white font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-brand-red hover:bg-[#ff4d4d] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-brand-red/20 disabled:opacity-50 active:scale-[0.98] mt-4 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-white/20 flex items-center justify-center gap-2">
              <Shield size={14} /> Enterprise Security Enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
