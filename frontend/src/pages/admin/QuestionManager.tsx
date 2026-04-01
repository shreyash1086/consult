import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Scenario, Question, QuestionType } from '../../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  GripVertical, 
  Save, 
  Loader2,
  HelpCircle,
  X,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const QuestionManager = () => {
  const { scenarioId } = useParams();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    text: '',
    type: QuestionType.MCQ,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option A',
    marks: 10,
    order: 0
  });

  useEffect(() => {
    fetchScenarioAndQuestions();
  }, [scenarioId]);

  const fetchScenarioAndQuestions = async () => {
    setLoading(true);
    try {
      const [sRes, qRes] = await Promise.all([
        api.get(`/admin/scenarios/${scenarioId}`),
        api.get(`/admin/scenarios/${scenarioId}/questions`)
      ]);
      // Note: Backend might not have direct GET /admin/scenarios/:id/questions yet, 
      // let's assume it's part of the scenario object or I'll need to add it.
      // For now, I'll update the backend route if needed.
      setScenario(sRes.data);
      setQuestions(qRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (question?: Question) => {
    if (question) {
      setEditingId(question.id);
      setFormData({
        text: question.text,
        type: question.type,
        options: (question.options as string[]) || ['A', 'B', 'C', 'D'],
        correctAnswer: question.correctAnswer || '',
        marks: question.marks,
        order: question.order
      });
    } else {
      setEditingId(null);
      setFormData({
        text: '',
        type: QuestionType.MCQ,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        marks: 10,
        order: questions.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/admin/questions/${editingId}`, formData);
        toast.success('Question updated');
      } else {
        await api.post(`/admin/scenarios/${scenarioId}/questions`, formData);
        toast.success('Question added');
      }
      fetchScenarioAndQuestions();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success('Question deleted');
      fetchScenarioAndQuestions();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-brand-red" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/scenarios" className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">Manage Questions</h1>
            <p className="text-white/40">{scenario?.title} • {questions.length} Items</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-red hover:bg-[#ff4d4d] text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Add Question
        </button>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="space-y-1 p-2">
          {questions.map((q, idx) => (
            <div key={q.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all group">
              <div className="cursor-grab text-white/10 group-hover:text-white/40 transition-colors">
                <GripVertical size={20} />
              </div>
              
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-white/40">
                {idx + 1}
              </div>

              <div className="flex-1">
                <p className="font-medium mb-1">{q.text}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/20 px-2 py-0.5 border border-white/10 rounded-md">
                    {q.type}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-red px-2 py-0.5 bg-brand-red/10 rounded-md">
                    {q.marks} Marks
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenModal(q)} className="p-2 text-white/20 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(q.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="py-20 text-center text-white/20">
               <HelpCircle size={48} className="mx-auto mb-4 opacity-10" />
               <p>No questions added to this scenario yet.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Question' : 'Add Question'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Question Text</label>
                <textarea
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red/50 transition-all text-white h-32"
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  placeholder="e.g. What are the key market drivers for digital banking in SE Asia?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Question Type</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red/50 transition-all text-white appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as QuestionType})}
                  >
                    <option value={QuestionType.MCQ} className="bg-[#1a1a1a] text-white py-2">Multiple Choice</option>
                    <option value={QuestionType.SHORT_ANSWER} className="bg-[#1a1a1a] text-white py-2">Short Answer</option>
                    <option value={QuestionType.LONG_ANSWER} className="bg-[#1a1a1a] text-white py-2">Long Answer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Marks</label>
                  <input
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red/50 transition-all text-white"
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {formData.type === QuestionType.MCQ && (
                <div className="space-y-4">
                  <label className="text-sm font-medium text-white/60">Options</label>
                  <div className="grid grid-cols-1 gap-3">
                    {formData.options.map((opt, i) => (
                      <div key={i} className="flex gap-3">
                        <input
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-brand-red/50 transition-all text-sm"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[i] = e.target.value;
                            setFormData({...formData, options: newOpts});
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, correctAnswer: opt})}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            formData.correctAnswer === opt ? 'bg-green-500 text-white' : 'bg-white/5 text-white/20 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(formData.type === QuestionType.SHORT_ANSWER || formData.type === QuestionType.LONG_ANSWER) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Ideal Answer Keywords (for AI)</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-brand-red/50 transition-all text-white h-32"
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                    placeholder="List the key concepts or points the candidate must mention..."
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-4">
               <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-brand-red text-white hover:bg-[#ff4d4d] font-bold shadow-lg shadow-brand-red/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (editingId ? 'Update' : 'Add Question')}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;
