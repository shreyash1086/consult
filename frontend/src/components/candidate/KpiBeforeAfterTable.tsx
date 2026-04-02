import React from 'react';
import { CompanyState } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiBeforeAfterTableProps {
  year0: CompanyState;
  candidate: CompanyState;
  optimal: CompanyState;
}

const KpiBeforeAfterTable: React.FC<KpiBeforeAfterTableProps> = ({ year0, candidate, optimal }) => {
  const kpis = [
    { key: 'revenue', label: 'Revenue', isCurrency: true },
    { key: 'grossClientMargin', label: 'Gross margin', isPercent: true },
    { key: 'totalHeadcount', label: 'Headcount' },
    { key: 'clientPerformanceIndex', label: 'Client perf index' },
    { key: 'employeeEngagement', label: 'Employee engmt' },
    { key: 'deliveryQuality', label: 'Delivery quality' },
    { key: 'riskScore', label: 'Risk score', lowerIsBetter: true },
  ];

  const formatValue = (key: string, val: number | undefined) => {
    if (val === undefined || val === null) return 'N/A';
    
    if (key === 'revenue') {
      if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    if (key === 'grossClientMargin' || key === 'employeeEngagement' || key === 'deliveryQuality' || key === 'clientPerformanceIndex') {
      return `${val.toFixed(1)}${key === 'grossClientMargin' ? '%' : ''}`;
    }
    return val.toLocaleString();
  };

  const getDelta = (key: string, current: number | undefined, prev: number | undefined, lowerIsBetter = false) => {
    if (current === undefined || prev === undefined) return { text: '-', color: 'text-white/20', icon: Minus };
    
    const diff = current - prev;
    const percent = prev !== 0 ? (diff / prev) * 100 : 0;
    
    if (Math.abs(diff) < 0.01) return { text: '-', color: 'text-white/20', icon: Minus };
    
    const isPositive = lowerIsBetter ? diff < 0 : diff > 0;
    const color = isPositive ? 'text-green-500' : 'text-red-500';
    const icon = diff > 0 ? TrendingUp : TrendingDown;
    
    let text = '';
    if (key === 'grossClientMargin') text = `${diff > 0 ? '▲' : '▼'}${Math.abs(diff).toFixed(1)}pp`;
    else if (key === 'revenue') text = `${diff > 0 ? '▲' : '▼'}${Math.abs(percent).toFixed(1)}%`;
    else text = `${diff > 0 ? '▲' : '▼'}${Math.abs(diff).toFixed(1)}`;

    return { text, color, icon };
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#1f1f1f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold">Company KPI impact of your solution</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-xs font-bold uppercase tracking-widest text-white/40">
              <th className="px-6 py-4">KPI</th>
              <th className="px-6 py-4">Year 0 (Before)</th>
              <th className="px-6 py-4">Year 1 (Your Result)</th>
              <th className="px-6 py-4">Optimal Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {kpis.map((kpi) => {
              const candDelta = getDelta(kpi.key, candidate[kpi.key as keyof CompanyState], year0[kpi.key as keyof CompanyState], kpi.lowerIsBetter);
              const optDelta = getDelta(kpi.key, optimal[kpi.key as keyof CompanyState], year0[kpi.key as keyof CompanyState], kpi.lowerIsBetter);

              return (
                <tr key={kpi.key} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white/80">{kpi.label}</td>
                  <td className="px-6 py-4 text-sm font-mono text-white/40">{formatValue(kpi.key, year0[kpi.key as keyof CompanyState])}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold">{formatValue(kpi.key, candidate[kpi.key as keyof CompanyState])}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 ${candDelta.color}`}>
                        {candDelta.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-white/40">{formatValue(kpi.key, optimal[kpi.key as keyof CompanyState])}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 ${optDelta.color} opacity-40`}>
                        {optDelta.text}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KpiBeforeAfterTable;
