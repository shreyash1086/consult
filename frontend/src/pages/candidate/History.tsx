import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Submission } from '../../types';
import { History as HistoryIcon, ChevronRight, Clock, Award, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const SubmissionsHistory = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/assessments/submissions')
      .then(({ data }) => setSubmissions(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-red" size={40} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">My Assessment History</h1>
        <p className="text-white/40">Review your past performance and growth</p>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-white/5">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40">Scenario</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40">Date Submitted</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40">Result</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                        <HistoryIcon size={20} />
                      </div>
                      <span className="font-bold text-white group-hover:text-brand-red transition-colors">{sub.scenario.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <Clock size={16} />
                      {format(new Date(sub.submittedAt), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'EVALUATED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {sub.evaluation ? (
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-brand-red" />
                        <span className="font-bold text-white">{Math.round(sub.evaluation.totalScore)}%</span>
                        <span className="text-xs text-white/20">Grade {sub.evaluation.grade}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/20 italic">Processing...</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      to={`/submissions/${sub.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-white/40 hover:text-brand-red transition-colors"
                    >
                      View Report <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && (
            <div className="p-20 text-center space-y-4">
               <HistoryIcon size={48} className="mx-auto text-white/10" />
               <p className="text-white/20">You haven't completed any assessments yet.</p>
               <Link to="/assessments" className="inline-block text-brand-red font-bold hover:underline">Browse Scenarios</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsHistory;
