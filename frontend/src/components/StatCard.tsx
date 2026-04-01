import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard = ({ label, value, icon, color, trend }: StatCardProps) => {
  return (
    <div className="bg-dark-card border border-white/5 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
      {/* Background glow effect */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] blur-3xl rounded-full -mr-8 -mt-8 group-hover:opacity-[0.08] transition-opacity`}></div>
      
      <div className="relative z-10 space-y-4">
        <div className={`w-12 h-12 ${color.replace('bg-', 'bg-opacity-10 ')} rounded-2xl flex items-center justify-center shadow-inner`}>
          {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
        </div>
        
        <div className="space-y-1">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
            {trend && (
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
