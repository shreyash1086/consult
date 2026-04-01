import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Scenario, Difficulty } from '../../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Lock, 
  Search, 
  Filter, 
  Loader2, 
  X, 
  HelpCircle,
  Building2,
  TrendingUp,
  Users,
  Target,
  FileText,
  BrainCircuit,
  AlertCircle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

const INITIAL_FORM_STATE = {
  title: '',
  industry: '',
  difficulty: Difficulty.MEDIUM,
  description: '',
  modelAnswer: '',
  isPublished: false,
  
  // Company identity
  companyName: '',
  companyTagline: '',

  // Financial KPIs
  revenue: 1200000000,
  grossClientMargin: 58.5,
  revenueGrowthYoY: -2.4,
  marginTrend: -1.2,

  // People KPIs
  totalHeadcount: 45000,
  partners: 1200,
  clientProfessionals: 38000,
  employeeTurnover: 18.2,
  employeeEngagement: 62.0,

  // Client KPIs
  numberOfClients: 850,
  numberOfEngagements: 2400,
  engagementsPerClient: 2.8,
  avgEngagementSize: 1500000,
  avgDaysSalesOutstanding: 82,
  clientRetention: 88.0,

  // Operational KPIs
  clientPerformanceIndex: 64.0,
  collaborationIndex: 58.0,
  deliveryQuality: 72.0,
  innovationIndex: 45.0,
  eminenceScore: 68.0,
  newCapabilitiesScore: 52.0,

  // Context
  criticalIssues: [] as string[],
  competitionContext: '',
  swotAnalysis: '',
  strategyPlanContext: '',
};

const ScenarioManager = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [newIssue, setNewIssue] = useState('');

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/scenarios');
      setScenarios(data);
    } catch (error) {
      toast.error('Failed to fetch scenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (scenario?: Scenario) => {
    if (scenario) {
      setEditingId(scenario.id);
      setFormData({
        ...INITIAL_FORM_STATE,
        ...scenario,
        criticalIssues: scenario.criticalIssues || [],
      });
    } else {
      setEditingId(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setActiveTab(0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/admin/scenarios/${editingId}`, formData);
        toast.success('Scenario updated');
      } else {
        await api.post('/admin/scenarios', formData);
        toast.success('Scenario created');
      }
      fetchScenarios();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save scenario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this scenario?')) return;
    try {
      await api.delete(`/admin/scenarios/${id}`);
      toast.success('Scenario deleted');
      setScenarios(scenarios.filter(s => s.id !== id));
    } catch (error) {
      toast.error('Failed to delete scenario');
    }
  };

  const addIssue = () => {
    if (!newIssue.trim()) return;
    setFormData(prev => ({
      ...prev,
      criticalIssues: [...prev.criticalIssues, newIssue.trim()]
    }));
    setNewIssue('');
  };

  const removeIssue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      criticalIssues: prev.criticalIssues.filter((_, i) => i !== index)
    }));
  };

  const handleNumberChange = (field: string, val: string) => {
    const num = parseFloat(val);
    setFormData(prev => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
  };

  const tabs = [
    { id: 0, label: 'Financials', icon: TrendingUp },
    { id: 1, label: 'People & Clients', icon: Users },
    { id: 2, label: 'Operations', icon: Target },
    { id: 3, label: 'Context & Issues', icon: FileText },
    { id: 4, label: 'AI Rubric', icon: BrainCircuit },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Scenario Manager</h1>
          <p className="text-white/40">Build high-fidelity digital twin simulation environments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-red hover:bg-[#ff4d4d] text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,51,51,0.2)]"
        >
          <PlusCircle size={20} /> Create High-Fi Scenario
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search simulations..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-red/50 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-all">
              <Filter size={18} /> Deep Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-white/[0.03]">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Corporation</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">KPI Snapshot (Rev / GCM)</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Complexity</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin inline text-brand-red" size={32} /></td></tr>
              ) : scenarios.map((scenario) => (
                <tr key={scenario.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center font-black text-brand-red">
                        {scenario.companyName?.substring(0,2).toUpperCase() || 'AX'}
                      </div>
                      <div>
                        <p className="font-bold text-white/90">{scenario.title}</p>
                        <p className="text-[10px] uppercase font-bold text-white/20 tracking-wider">
                          {scenario.companyName} • {scenario.industry}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-mono font-bold text-white/70">${(scenario.revenue / 1000000).toFixed(1)}M</span>
                       <span className={`text-[10px] font-bold ${scenario.grossClientMargin < 55 ? 'text-brand-red' : 'text-green-500'}`}>
                         {scenario.grossClientMargin}% GCM
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-md border ${
                      scenario.difficulty === Difficulty.EASY ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                      scenario.difficulty === Difficulty.MEDIUM ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {scenario.isPublished ? (
                      <span className="flex items-center gap-1.5 text-[10px] text-green-500 uppercase font-black tracking-widest">
                        <Globe size={12} /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] text-white/20 uppercase font-black tracking-widest">
                        <Lock size={12} /> Sandbox
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                       <Link to={`/admin/scenarios/${scenario.id}/questions`} className="p-2 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-all">
                        <HelpCircle size={18} />
                       </Link>
                       <button onClick={() => handleOpenModal(scenario)} className="p-2 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                        <Edit size={18} />
                       </button>
                       <button onClick={() => handleDelete(scenario.id)} className="p-2 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REWRITE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-[#111] border border-white/10 rounded-[32px] w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            
            {/* Modal Header */}
            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-10">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{editingId ? 'Refining Scenario' : 'Engineering New Simulation'}</h2>
                  <p className="text-[10px] uppercase font-bold text-white/20 tracking-[0.2em] mt-1">Digital Twin Logic Designer</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                        activeTab === tab.id 
                          ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full text-white/20 hover:text-white hover:bg-white/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                
                {/* TAB 0: FINANCIALS & IDENTITY */}
                {activeTab === 0 && (
                  <div className="space-y-12 max-w-4xl">
                     <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                           <Building2 size={16} /> Corporate Identity
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Case Title</label>
                              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" placeholder="e.g. Project AX-1: Market Entry" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Industry</label>
                              <input required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" placeholder="e.g. Life Sciences" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Company Name</label>
                              <input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" placeholder="e.g. Axon Corp" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Company Tagline</label>
                              <input value={formData.companyTagline} onChange={e => setFormData({...formData, companyTagline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" placeholder="e.g. Pioneering Future Tech" />
                           </div>
                        </div>
                     </section>

                     <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                           <TrendingUp size={16} /> Financial Architecture (Year 0)
                        </h3>
                        <div className="grid grid-cols-4 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Revenue ($)</label>
                              <input type="number" value={formData.revenue} onChange={e => handleNumberChange('revenue', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red font-mono" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">GCM (%)</label>
                              <input type="number" step="0.1" value={formData.grossClientMargin} onChange={e => handleNumberChange('grossClientMargin', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red font-mono" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">YoY Growth (%)</label>
                              <input type="number" step="0.1" value={formData.revenueGrowthYoY} onChange={e => handleNumberChange('revenueGrowthYoY', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red font-mono" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Margin Trend (pp)</label>
                              <input type="number" step="0.1" value={formData.marginTrend} onChange={e => handleNumberChange('marginTrend', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red font-mono" />
                           </div>
                        </div>
                     </section>
                  </div>
                )}

                {/* TAB 1: PEOPLE & CLIENTS */}
                {activeTab === 1 && (
                  <div className="space-y-12 max-w-4xl">
                     <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                           <Users size={16} /> Human Capital Analytics
                        </h3>
                        <div className="grid grid-cols-3 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Total Headcount</label>
                              <input type="number" value={formData.totalHeadcount} onChange={e => handleNumberChange('totalHeadcount', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Partners & Directors</label>
                              <input type="number" value={formData.partners} onChange={e => handleNumberChange('partners', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Turnover (%)</label>
                              <input type="number" step="0.1" value={formData.employeeTurnover} onChange={e => handleNumberChange('employeeTurnover', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" />
                           </div>
                        </div>
                     </section>

                     <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                           <Target size={16} /> Client Portfolio
                        </h3>
                        <div className="grid grid-cols-4 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Num Clients</label>
                              <input type="number" value={formData.numberOfClients} onChange={e => handleNumberChange('numberOfClients', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Engmt/Client</label>
                              <input type="number" step="0.1" value={formData.engagementsPerClient} onChange={e => handleNumberChange('engagementsPerClient', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Avg DSO (Days)</label>
                              <input type="number" value={formData.avgDaysSalesOutstanding} onChange={e => handleNumberChange('avgDaysSalesOutstanding', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Retention (%)</label>
                              <input type="number" step="0.1" value={formData.clientRetention} onChange={e => handleNumberChange('clientRetention', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" />
                           </div>
                        </div>
                     </section>
                  </div>
                )}

                {/* TAB 2: OPERATIONAL KPIs */}
                {activeTab === 2 && (
                  <div className="space-y-12 max-w-4xl">
                     <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                           <Target size={16} /> Pulse & Quality Indexes (0-100)
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                           {[
                             { label: 'Client Perf Index', field: 'clientPerformanceIndex' },
                             { label: 'Collaboration Index', field: 'collaborationIndex' },
                             { label: 'Delivery Quality', field: 'deliveryQuality' },
                             { label: 'Innovation Index', field: 'innovationIndex' },
                             { label: 'Employee Engagement', field: 'employeeEngagement' },
                             { label: 'Eminence Score', field: 'eminenceScore' },
                             { label: 'New Cap. Score', field: 'newCapabilitiesScore' }
                           ].map(item => (
                             <div key={item.field} className="space-y-2">
                                <label className="text-xs uppercase font-bold text-white/30">{item.label}</label>
                                <input type="number" value={(formData as any)[item.field]} onChange={e => handleNumberChange(item.field, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red font-mono" />
                             </div>
                           ))}
                        </div>
                     </section>
                  </div>
                )}

                {/* TAB 3: CONTEXT & ISSUES */}
                {activeTab === 3 && (
                  <div className="space-y-12 max-w-4xl">
                     <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                           <AlertCircle size={16} /> Critical Issues List
                        </h3>
                        <div className="space-y-4">
                           <div className="flex gap-2">
                              <input value={newIssue} onChange={e => setNewIssue(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red" placeholder="Add logical pressure point..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIssue())} />
                              <button type="button" onClick={addIssue} className="px-6 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-xl font-bold hover:bg-brand-red hover:text-white transition-all">Add</button>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {formData.criticalIssues.map((issue, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 group">
                                   <span className="text-sm text-white/60">{issue}</span>
                                   <button type="button" onClick={() => removeIssue(i)} className="text-white/20 hover:text-brand-red transition-colors opacity-0 group-hover:opacity-100"><MinusCircle size={14} /></button>
                                </div>
                              ))}
                           </div>
                        </div>
                     </section>

                     <section className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                           <FileText size={16} /> Contextual Deep Dives (Markdown)
                        </h3>
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">General Case Description & Exhibits</label>
                              <div data-color-mode="dark"><MDEditor value={formData.description} onChange={val => setFormData({...formData, description: val || ''})} height={300} /></div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs uppercase font-bold text-white/30">Competitive Intelligence</label>
                              <div data-color-mode="dark"><MDEditor value={formData.competitionContext} onChange={val => setFormData({...formData, competitionContext: val || ''})} height={200} /></div>
                           </div>
                        </div>
                     </section>
                  </div>
                )}

                {/* TAB 4: RUBRIC */}
                {activeTab === 4 && (
                   <div className="space-y-12 max-w-4xl">
                      <section className="space-y-6">
                         <h3 className="text-sm font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                            <BrainCircuit size={16} /> Strategic North Star
                         </h3>
                         <div className="space-y-2">
                           <label className="text-xs uppercase font-bold text-white/30">Optimal Solution Architecture (AI Ground Truth)</label>
                           <textarea required value={formData.modelAnswer} onChange={e => setFormData({...formData, modelAnswer: e.target.value})} className="w-full min-h-[400px] bg-white/5 border border-white/10 rounded-xl p-10 outline-none focus:border-brand-red text-white/80 font-serif text-lg leading-relaxed" placeholder="Define the optimal trajectory..." />
                         </div>
                      </section>
                      
                      <section className="p-8 bg-brand-red/5 border border-brand-red/20 rounded-2xl flex items-center justify-between">
                         <div>
                            <h4 className="font-bold text-brand-red">Simulation Difficulty Policy</h4>
                            <p className="text-xs text-brand-red/60 uppercase tracking-widest font-black mt-1">Affects agentic pressure & threshold weights</p>
                         </div>
                         <div className="flex gap-2">
                            {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map(d => (
                              <button key={d} type="button" onClick={() => setFormData({...formData, difficulty: d})} className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.difficulty === d ? 'bg-brand-red border-brand-red text-white' : 'border-white/10 text-white/20 hover:border-white/40'}`}>
                                {d}
                              </button>
                            ))}
                         </div>
                      </section>

                      <div className="flex items-center justify-between p-8 bg-[#1f1f1f] rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-6 rounded-full transition-all ${formData.isPublished ? 'bg-brand-red' : 'bg-white/10'} relative p-1 cursor-pointer`} onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}>
                              <div className={`w-4 h-4 rounded-full bg-white transition-all ${formData.isPublished ? 'translate-x-6' : ''}`} />
                           </div>
                           <div>
                              <span className="text-xs font-bold uppercase tracking-widest text-white/80">Live Deployment</span>
                              <p className="text-[10px] text-white/20 uppercase font-black">Make available in candidate assessment portal</p>
                           </div>
                        </div>
                      </div>
                   </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-10 py-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all font-bold uppercase text-[10px] tracking-widest">Discard</button>
                <button type="submit" disabled={isSubmitting} className="px-12 py-3 rounded-xl bg-brand-red text-white hover:bg-[#ff4d4d] transition-all font-bold shadow-2xl shadow-brand-red/40 uppercase text-[10px] tracking-widest disabled:opacity-50">
                  {isSubmitting ? 'Synchronizing Digital Twin...' : (editingId ? 'Push Updates' : 'Initialize Simulation')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;

