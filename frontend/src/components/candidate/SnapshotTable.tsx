import React from 'react';
import { Scenario } from '../../types';

interface SnapshotTableProps {
  scenario: Scenario;
}

const SnapshotTable: React.FC<SnapshotTableProps> = ({ scenario }) => {
  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const rows = [
    { label: 'Revenue', value: formatCurrency(scenario.revenue) },
    { label: 'Gross client margin', value: `${scenario.grossClientMargin.toFixed(1)}%` },
    { label: 'Total headcount', value: scenario.totalHeadcount.toLocaleString() },
    { label: 'Partners & directors', value: scenario.partners.toLocaleString() },
    { label: 'Client service professionals', value: scenario.clientProfessionals.toLocaleString() },
    { label: 'Number of clients', value: scenario.numberOfClients.toLocaleString() },
    { label: 'Number of engagements', value: scenario.numberOfEngagements.toLocaleString() },
    { label: 'Engagements per client', value: scenario.engagementsPerClient.toFixed(1) },
    { label: 'Avg engagement size', value: formatCurrency(scenario.avgEngagementSize) },
    { label: 'Avg Days Sales Outstanding (DSO)', value: scenario.avgDaysSalesOutstanding.toString() },
    { label: 'Client retention', value: `${scenario.clientRetention.toFixed(1)}%` },
  ];

  return (
    <div className="bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden">
      <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-white/60">
        <span>AX by the Numbers</span>
        <span>Year 0</span>
      </div>
      <div className="divide-y divide-white/5">
        {rows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center px-4 py-2.5 text-sm">
            <span className="text-white/60">{row.label}</span>
            <span className="text-white font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnapshotTable;
