import React from 'react';
import { DivergencePoint } from '../../types';
import { CheckCircle2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface DecisionTimelineProps {
  points: DivergencePoint[];
}

const DecisionTimeline: React.FC<DecisionTimelineProps> = ({ points }) => {
  return (
    <div className="relative space-y-12 pl-12 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/5">
      {points.map((point, idx) => {
        const isOptimal = point.candidateAction === point.optimalAction;
        
        return (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[30px] top-4 w-5 h-5 rounded-full border-4 border-[#161616] z-10 transition-transform group-hover:scale-125 ${
              isOptimal ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-brand-red shadow-[0_0_15px_rgba(255,51,51,0.4)]'
            }`} />

            <div className="bg-[#1f1f1f] border border-white/10 rounded-2xl p-8 space-y-8 shadow-xl transition-all hover:bg-white/[0.04]">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30">Step {point.stepNumber}</span>
                  {isOptimal ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-tight">
                      <CheckCircle2 size={12} /> Strategic Alignment
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-brand-red bg-brand-red/10 px-3 py-1 rounded-full uppercase tracking-tight">
                      <AlertCircle size={12} /> Divergence Detected
                    </span>
                  )}
                </div>
                {!isOptimal && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Impact Severity</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`w-3 h-1.5 rounded-full ${
                          s <= Math.ceil(point.impactScore / 2) ? 'bg-brand-red' : 'bg-white/5'
                        }`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Your strategy</h4>
                  <div className={`p-5 rounded-xl border ${
                    isOptimal ? 'bg-green-500/5 border-green-500/20' : 'bg-brand-red/10 border-brand-red/30'
                  } text-white/80 leading-relaxed`}>
                    {point.candidateAction}
                  </div>
                </div>
                {!isOptimal && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Optimal strategy</h4>
                    <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20 text-white/80 leading-relaxed italic">
                      {point.optimalAction}
                    </div>
                  </div>
                )}
              </div>

              {/* Reasoning */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Strategic Analysis</h4>
                <p className="text-white/60 leading-relaxed font-serif text-lg">
                  {point.explanation}
                </p>
              </div>

              {/* KPI Outcome Difference (Simple version) */}
              {!isOptimal && (
                <div className="flex flex-wrap gap-8 pt-4 border-t border-white/5">
                   <div className="space-y-1">
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-tight">Main Variance</span>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-white/60">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                           Your Solution: <span className="text-white">Low Margin Gain</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/60">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                           Optimal logic: <span className="text-white">High Margin / Engagement Balance</span>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DecisionTimeline;
