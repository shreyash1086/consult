import React from 'react';
import { Scenario } from '../../types';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface KpiTickerBarProps {
  scenario: Scenario;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  onNavigateToConsultation: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const WARN_THRESHOLDS = {
  grossClientMargin: 55,
  clientPerformanceIndex: 65,
  collaborationIndex: 65,
  deliveryQuality: 70,
  innovationIndex: 65,
  eminenceScore: 60,
  newCapabilitiesScore: 65,
  employeeEngagement: 70,
  employeeTurnover: 15,
};

const KpiTickerBar: React.FC<KpiTickerBarProps> = ({ 
  scenario, 
  timeLeft, 
  formatTime, 
  onNavigateToConsultation,
  onSubmit, 
  isSubmitting 
}) => {
  const getKpiStatus = (key: keyof typeof WARN_THRESHOLDS, value: number) => {
    if (key === 'employeeTurnover') {
      return value > WARN_THRESHOLDS[key] ? 'warn' : 'target';
    }
    return value < WARN_THRESHOLDS[key] ? 'warn' : 'target';
  };

  const getStyle = (status: 'warn' | 'target') => {
    return status === 'warn' ? 'text-[#e05030]' : 'text-[#f0c040]';
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#1a1a1a] border-b border-white/10 flex items-center px-6 z-50 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-8 min-w-max">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center font-bold text-white">AX</div>
          <span className="text-white font-bold opacity-80">{scenario.companyName}</span>
        </div>

        {/* KPIs */}
        <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
          <div className="flex flex-col">
            <span className="text-white/40">Revenue</span>
            <span className="text-white font-bold">{formatCurrency(scenario.revenue)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-white/40">GCM</span>
            <span className={`${getStyle(getKpiStatus('grossClientMargin', scenario.grossClientMargin))} font-bold`}>
              {scenario.grossClientMargin}% {scenario.marginTrend < 0 ? '▼' : '▲'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40">CPI</span>
            <span className={`${getStyle(getKpiStatus('clientPerformanceIndex', scenario.clientPerformanceIndex))} font-bold`}>
              {scenario.clientPerformanceIndex}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40">Engagement</span>
            <span className={`${getStyle(getKpiStatus('employeeEngagement', scenario.employeeEngagement))} font-bold`}>
              {scenario.employeeEngagement}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40">Collab</span>
            <span className={`${getStyle(getKpiStatus('collaborationIndex', scenario.collaborationIndex))} font-bold`}>
              {scenario.collaborationIndex}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40">Delivery</span>
            <span className={`${getStyle(getKpiStatus('deliveryQuality', scenario.deliveryQuality))} font-bold`}>
              {scenario.deliveryQuality}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40">Innov.</span>
            <span className={`${getStyle(getKpiStatus('innovationIndex', scenario.innovationIndex))} font-bold`}>
              {scenario.innovationIndex}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40">Eminence</span>
            <span className={`${getStyle(getKpiStatus('eminenceScore', scenario.eminenceScore))} font-bold`}>
              {scenario.eminenceScore}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40">NewCap</span>
            <span className={`${getStyle(getKpiStatus('newCapabilitiesScore', scenario.newCapabilitiesScore))} font-bold`}>
              {scenario.newCapabilitiesScore}
            </span>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-6">
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded border ${timeLeft < 300 ? 'border-red-500 bg-red-500/10 text-red-500 animate-pulse' : timeLeft < 600 ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-white/20 text-white/60'}`}>
          <Clock size={16} />
          <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-brand-red hover:bg-[#ff4d4d] text-white text-sm font-bold px-6 py-2 rounded transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT SOLUTION'}
        </button>
      </div>
    </div>
  );
};

export default KpiTickerBar;
