import React from 'react';
import { User, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portal = () => {
  return (
    <div className="min-h-screen bg-near-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>

      <div className="z-10 text-center mb-16">
        <div className="w-16 h-16 bg-brand-red rounded-3xl mx-auto flex items-center justify-center font-bold text-3xl text-white shadow-2xl shadow-brand-red/20 mb-6 active:scale-95 transition-transform">
          C
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-brand-red">Consult Practice</span>
        </h1>
        <p className="text-white/40 font-medium mt-4 text-lg">Platform for future lead consultants</p>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Candidate Card */}
        <div className="bg-dark-card border border-white/5 rounded-[2rem] p-10 flex flex-col transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-red/10 hover:border-brand-red/50 group">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform group-hover:text-brand-red group-hover:bg-brand-red/10">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-brand-red transition-colors">Candidate Portal</h2>
          <p className="text-white/40 text-base leading-relaxed mb-12 flex-1 group-hover:text-white/60 transition-colors">
            Access your assigned courses, take rigorous consulting assessments, and track your learning progress in real-time.
          </p>
          <Link
            to="/login"
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-brand-red text-white font-bold text-center flex items-center justify-center gap-2 transition-all mt-auto border border-white/10 hover:border-brand-red group-hover:shadow-lg group-hover:shadow-brand-red/20"
          >
            Select Role <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Admin Card */}
        <div className="bg-dark-card border border-white/5 rounded-[2rem] p-10 flex flex-col transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-red/10 hover:border-brand-red/50 group">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform group-hover:text-brand-red group-hover:bg-brand-red/10">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-brand-red transition-colors">Admin Portal</h2>
          <p className="text-white/40 text-base leading-relaxed mb-12 flex-1 group-hover:text-white/60 transition-colors">
            Oversee platform usage, manage users, generate dynamic AI evaluation rubrics, and configure system settings.
          </p>
          <Link
            to="/login"
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-brand-red text-white font-bold text-center flex items-center justify-center gap-2 transition-all mt-auto border border-white/10 hover:border-brand-red group-hover:shadow-lg group-hover:shadow-brand-red/20"
          >
            Select Role <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Portal;
