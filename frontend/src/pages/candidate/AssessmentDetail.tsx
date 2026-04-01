import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Scenario, Question, QuestionType, SubmissionStatus } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle, 
  Loader2, 
  LayoutDashboard,
  Users,
  Target,
  BarChart3,
  FileText,
  Search,
  Timer
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import KpiTickerBar from '../../components/candidate/KpiTickerBar';
import SnapshotTable from '../../components/candidate/SnapshotTable';
import CriticalIssuesPanel from '../../components/candidate/CriticalIssuesPanel';
import ConsultationInput from '../../components/candidate/ConsultationInput';

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [consultationText, setConsultationText] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'competition' | 'swot' | 'strategy' | 'questions'>('overview');
  const [timeLeft, setTimeLeft] = useState(45 * 60); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const consultationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/assessments/${id}`)
      .then(({ data }) => {
        setScenario(data);
        // If it's already submitted/evaluated (unlikely button logic but safe)
        if (data.status === SubmissionStatus.EVALUATED) {
          navigate(`/submissions/${id}`);
        }
      })
      .catch(() => {
        toast.error('Assessment not found or not published.');
        navigate('/assessments');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/assessments/${id}/submit`, {
        consultationText,
        questionAnswers: answers,
        timeTaken: 45 * 60 - timeLeft
      });
      toast.success('Simulation and Evaluation started...');
      navigate(`/submissions/${data.submissionId}`);
    } catch (error) {
      toast.error('Failed to submit assessment.');
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#111] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-brand-red" size={48} />
        <span className="text-white/40 font-mono text-sm animate-pulse tracking-widest uppercase">Initializing Digital Twin...</span>
      </div>
    </div>
  );

  if (!scenario) return null;

  return (
    <div className="min-h-screen bg-[#111] text-white pt-16">
      {/* Top Ticker Bar */}
      <KpiTickerBar 
        scenario={scenario} 
        timeLeft={timeLeft} 
        formatTime={formatTime}
        onNavigateToConsultation={() => consultationRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onSubmit={() => {
          if (window.confirm('Ready to run the digital twin simulation with your current solution?')) handleSubmit();
        }}
        isSubmitting={isSubmitting}
      />

      <div className="flex">
        {/* Left Sidebar Layout Icons */}
        <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-8 sticky top-16 h-[calc(100vh-64px)] bg-[#111]">
          <LayoutDashboard className="text-brand-red opacity-80 cursor-pointer hover:opacity-100" size={20} />
          <Users className="text-white/20 hover:text-white/40 cursor-pointer" size={20} />
          <Target className="text-white/20 hover:text-white/40 cursor-pointer" size={20} />
          <BarChart3 className="text-white/20 hover:text-white/40 cursor-pointer" size={20} />
          <FileText className="text-white/20 hover:text-white/40 cursor-pointer" size={20} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#161616]">
          {/* Tabs Navigation */}
          <div className="bg-[#1a1a1a] border-b border-white/10 flex px-8">
            {[
              { id: 'overview', label: `${scenario.companyName} Overview` },
              { id: 'competition', label: 'The Competition' },
              { id: 'swot', label: 'SWOT Analysis' },
              { id: 'strategy', label: 'Strategy Plan' },
              { id: 'questions', label: 'Questions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-brand-red text-white' 
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 pb-24 max-w-7xl mx-auto space-y-12">
            
            {/* Split View for Context */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Panel: Detailed Views */}
              <div className="lg:col-span-8 space-y-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <SnapshotTable scenario={scenario} />
                    <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-8 prose prose-invert max-w-none prose-p:text-white/60 prose-headings:text-inherit">
                      <h2 className="text-lg font-bold text-white mb-4">Strategic Context</h2>
                      <ReactMarkdown>{scenario.description}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {activeTab === 'competition' && (
                  <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-8 prose prose-invert max-w-none">
                    <ReactMarkdown>{scenario.competitionContext || "*No competition data provided for this scenario.*"}</ReactMarkdown>
                  </div>
                )}

                {activeTab === 'swot' && (
                  <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-8 prose prose-invert max-w-none">
                    <ReactMarkdown>{scenario.swotAnalysis || "*No SWOT analysis provided for this scenario.*"}</ReactMarkdown>
                  </div>
                )}

                {activeTab === 'strategy' && (
                  <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-8 prose prose-invert max-w-none">
                    <ReactMarkdown>{scenario.strategyPlanContext || "*No strategy plan details provided for this scenario.*"}</ReactMarkdown>
                  </div>
                )}

                {activeTab === 'questions' && (
                  <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-8 space-y-10">
                    <h2 className="text-lg font-bold">Key Assessment Questions</h2>
                    <div className="space-y-10">
                      {scenario.questions?.map((q, idx) => (
                        <div key={q.id} className="space-y-4">
                          <p className="text-white/90 font-medium">{idx + 1}. {q.text}</p>
                          {q.type === QuestionType.MCQ ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(q.options as string[]).map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => handleAnswerChange(q.id, opt)}
                                  className={`text-left px-5 py-3 rounded-lg border text-sm transition-all ${
                                    answers[q.id] === opt 
                                      ? 'bg-brand-red/10 border-brand-red text-white' 
                                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <textarea
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 outline-none focus:border-brand-red/50 text-white/80 h-32 resize-none"
                              placeholder="Type your structured answer here..."
                              value={answers[q.id] || ''}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel: Vital Info */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <CriticalIssuesPanel scenario={scenario} />
                
                <div className="bg-[#1f1f1f] border border-white/10 rounded-lg p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                    <Timer size={14} /> Global Time Remaining
                  </h3>
                  <div className="text-3xl font-mono font-bold flex items-baseline gap-2">
                    <span className={timeLeft < 300 ? 'text-[#e05030]' : 'text-[#f0c040]'}>{formatTime(timeLeft)}</span>
                    <span className="text-xs text-white/20 uppercase">Minutes</span>
                  </div>
                  {timeLeft < 300 && (
                     <p className="text-[10px] text-[#e05030] mt-2 animate-pulse font-bold tracking-tight">AUTO-SUBMIT IMMINENT</p>
                  )}
                </div>
              </div>
            </div>

            {/* Consultation Area */}
            <div ref={consultationRef} className="pt-12 border-t border-white/5">
              <ConsultationInput 
                value={consultationText}
                onChange={setConsultationText}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;

