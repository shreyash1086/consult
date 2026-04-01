import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import { 
  Trophy, 
  Target, 
  Clock, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

const data = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 78 },
  { name: 'Sat', score: 90 },
  { name: 'Sun', score: 88 },
];

const CandidateDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/assessments/stats').then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, <span className="text-brand-red">{user?.name}</span>
          </h1>
          <p className="text-white/40 text-lg">Continue your journey to becoming a top consultant.</p>
        </div>
        <Link 
          to="/assessments" 
          className="bg-brand-red hover:bg-[#ff4d4d] text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-brand-red/20 active:scale-95 group"
        >
          <Zap size={20} className="fill-white" />
          Start Practice
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Avg. Accuracy" 
          value={`${stats?.avgScore || 0}%`} 
          icon={<Target className="text-brand-red" />} 
          color="bg-brand-red"
          trend="+5.2%"
        />
        <StatCard 
          label="Completed" 
          value={stats?.completedCount || 0} 
          icon={<Trophy className="text-yellow-500" />} 
          color="bg-yellow-500"
        />
        <StatCard 
          label="Practice Time" 
          value={`${Math.round((stats?.totalTime || 0) / 60)}h`} 
          icon={<Clock className="text-blue-500" />} 
          color="bg-blue-500"
        />
        <StatCard 
          label="Global Rank" 
          value="#12" 
          icon={<Award className="text-purple-500" />} 
          color="bg-purple-500"
          trend="Top 5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-dark-card border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={120} />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold mb-1">Performance Trend</h2>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Weekly Analytics</p>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/40">
              Last 7 Days
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E84040" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E84040" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#E84040', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#E84040" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suggested Next Steps */}
        <div className="bg-dark-card border border-white/5 rounded-[32px] p-8 shadow-2xl">
          <h2 className="text-xl font-bold mb-6">Recommended for You</h2>
          <div className="space-y-4">
            {[
              { title: 'Advanced Market Sizing', type: 'Framework', diff: 'Hard' },
              { title: 'Profitability Patterns', type: 'Case Study', diff: 'Medium' },
              { title: 'Digital Strategy 101', type: 'Concept', diff: 'Easy' }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                <div className="space-y-1">
                  <p className="font-bold text-sm group-hover:text-brand-red transition-colors">{item.title}</p>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{item.type} • {item.diff}</p>
                </div>
                <ChevronRight size={18} className="text-white/10 group-hover:text-white" />
              </div>
            ))}
            <Link to="/assessments" className="block text-center pt-4 text-xs font-bold text-brand-red uppercase tracking-widest hover:underline">
              View All Scenarios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
