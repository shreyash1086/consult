import React from 'react';
import { Scenario } from '../../types';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface CriticalIssuesPanelProps {
  scenario: Scenario;
}

const CriticalIssuesPanel: React.FC<CriticalIssuesPanelProps> = ({ scenario }) => {
  const kpis = [
    { 
      label: 'Revenue trend', 
      value: `${scenario.revenueGrowthYoY > 0 ? '+' : ''}${scenario.revenueGrowthYoY.toFixed(1)}%`, 
      isPositive: scenario.revenueGrowthYoY > 0 
    },
    { 
      label: 'Margin trend', 
      value: `${scenario.marginTrend > 0 ? '+' : ''}${scenario.marginTrend.toFixed(1)}pp`, 
      isPositive: scenario.marginTrend > 0 
    },
    { 
      label: 'Client retention', 
      value: `${scenario.clientRetention.toFixed(1)}%`, 
      isPositive: scenario.clientRetention > 85 // threshold
    },
    { 
      label: 'Employee turnover', 
      value: `${scenario.employeeTurnover.toFixed(1)}%`, 
      isPositive: scenario.employeeTurnover < 15 // threshold
    },
  ];

  return (
    <div className="space-y-6">
      {/* Critical Issues */}
      <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-brand-red" /> Critical Issues
        </h3>
        <ul className="space-y-3">
          {scenario.criticalIssues?.map((issue, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-white/70 leading-relaxed">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5" />
              {issue}
            </li>
          ))}
        </ul>
      </div>

      {/* Mini KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-[#1f1f1f] border border-white/10 rounded-lg p-4">
            <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">{kpi.label}</span>
            <div className={`flex items-center gap-2 ${kpi.isPositive ? 'text-[#f0c040]' : 'text-[#e05030]'}`}>
              <span className="text-lg font-bold font-mono">{kpi.value}</span>
              {kpi.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticalIssuesPanel;
