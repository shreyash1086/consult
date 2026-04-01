import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import { Users, ClipboardCheck, BarChart4, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

const AdminAnalytics = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/analytics/overview').then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-white/40">Real-time overview of training effectiveness and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Candidates" 
          value={stats?.totalCandidates || 0} 
          icon={<Users className="text-blue-500" />} 
          color="bg-blue-500"
        />
        <StatCard 
          label="Submissions" 
          value={stats?.totalSubmissions || 0} 
          icon={<ClipboardCheck className="text-green-500" />} 
          color="bg-green-500"
        />
        <StatCard 
          label="Avg. Platform Score" 
          value={`${Math.round(stats?.platformAvgScore || 0)}%`} 
          icon={<BarChart4 className="text-brand-red" />} 
          color="bg-brand-red"
        />
        <StatCard 
          label="Activity Growth" 
          value="14%" 
          icon={<TrendingUp className="text-yellow-500" />} 
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-white/5 rounded-3xl p-8">
           <h2 className="text-xl font-bold mb-6">Top Performers</h2>
           <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center font-bold text-brand-red">#{i}</div>
                    <div>
                      <p className="font-bold">Candidate {i}</p>
                      <p className="text-xs text-white/40">{10 - i} Assessments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500">{98 - i}%</p>
                    <p className="text-xs text-white/40">Avg Accuracy</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-dark-card border border-white/5 rounded-3xl p-8">
           <h2 className="text-xl font-bold mb-6">Scenario Effectiveness</h2>
           <div className="space-y-6">
              {[
                { title: 'Digital Transformation', completions: 45, avg: 72 },
                { title: 'Market Entry Strategy', completions: 32, avg: 81 },
                { title: 'Supply Chain Resiliency', completions: 28, avg: 65 },
                { title: 'Customer Experience', completions: 19, avg: 78 }
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.title}</span>
                    <span className="text-white/40">{s.completions} submissions</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red" style={{ width: `${s.avg}%` }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
