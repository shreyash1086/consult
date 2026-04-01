import React, { useEffect, useState } from 'react';
import { Search, Filter, Play, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { Scenario, Difficulty } from '../../types';
import { Link } from 'react-router-dom';

const AssessmentList = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/assessments')
      .then(({ data }) => setScenarios(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-red" size={40} />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Practice Scenarios</h1>
          <p className="text-white/40">Select a case to begin your consultation evaluation.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search scenarios..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-brand-red/50 transition-all text-sm w-64"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-dark-card border border-white/5 rounded-[32px] p-8 flex flex-col group hover:border-brand-red/30 transition-all shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-red/5 blur-2xl rounded-full"></div>
            
            <div className="flex items-center justify-between mb-6">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                scenario.difficulty === Difficulty.EASY ? 'text-green-400 bg-green-500/10' :
                scenario.difficulty === Difficulty.MEDIUM ? 'text-yellow-400 bg-yellow-500/10' : 'text-red-400 bg-red-500/10'
              }`}>
                {scenario.difficulty}
              </span>
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{scenario.industry}</span>
            </div>

            <h3 className="text-xl font-bold mb-4 group-hover:text-brand-red transition-colors line-clamp-1">
              {scenario.title}
            </h3>
            <p className="text-white/40 text-sm mb-8 line-clamp-3 leading-relaxed">
              {scenario.description.replace(/[#*]/g, '')}
            </p>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/20">
                <Circle size={12} />
                <span>Not Started</span>
              </div>
              <Link 
                to={`/assessments/${scenario.id}`}
                className="bg-white/5 group-hover:bg-brand-red text-white p-3 rounded-2xl transition-all shadow-lg group-hover:shadow-brand-red/20 active:scale-90"
              >
                <Play size={18} fill="currentColor" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentList;
