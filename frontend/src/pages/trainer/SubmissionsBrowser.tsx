import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Submission } from '../../types';
import { Search, Filter, Eye, Clock, Calendar, CheckSquare, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubmissionsBrowser = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/trainer/submissions');
      setSubmissions(data);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Submission Browser</h1>
        <p className="text-white/40">Review and analyze candidate consultation outputs</p>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-md flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search candidates or scenarios..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-red/50 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-all">
                <Calendar size={14} /> Last 7 Days
              </div>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-white transition-all">
                <CheckSquare size={14} /> All Grades
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-all">
            <Filter size={18} /> More Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-white/5">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Candidate</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Scenario</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Date</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Score</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin inline text-brand-red" /></td></tr>
              ) : submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 font-bold">{sub.user?.name}</td>
                  <td className="px-8 py-5">
                    <p className="text-sm">{sub.scenario.title}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Clock size={14} />
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {sub.evaluation ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-red" style={{ width: `${sub.evaluation.totalScore}%` }}></div>
                        </div>
                        <span className="font-bold text-brand-red">{Math.round(sub.evaluation.totalScore)}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/20 italic">Pending AI...</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsBrowser;
