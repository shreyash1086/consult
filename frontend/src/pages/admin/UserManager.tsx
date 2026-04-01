import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { User, Role } from '../../types';
import { Plus, UserPlus, Mail, Shield, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.CANDIDATE
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/users', formData);
      toast.success('User created successfully');
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-white/40">Manage trainer and candidate accounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-red hover:bg-[#ff4d4d] text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20"
        >
          <UserPlus size={20} /> Add New User
        </button>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-white/5">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">User</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Role</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Joined Date</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin inline text-brand-red" /></td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white/20">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-white/40 flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                      user.role === Role.ADMIN ? 'text-purple-400 bg-purple-500/10' :
                      user.role === Role.TRAINER ? 'text-blue-400 bg-blue-500/10' : 'text-orange-400 bg-orange-500/10'
                    }`}>
                      {user.role === Role.ADMIN ? <Shield size={12} /> : user.role === Role.TRAINER ? <ShieldCheck size={12} /> : null}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-white/40">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-xs font-medium text-white/60">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-white/10 rounded-3xl w-full max-w-md shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Full Name</label>
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-brand-red/50 transition-all text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-brand-red/50 transition-all text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Security Key (Password)</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-brand-red/50 transition-all text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter secure key..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Role</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-brand-red/50 transition-all text-white appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                >
                  <option value={Role.CANDIDATE} className="bg-[#1a1a1a] text-white py-2">Candidate</option>
                  <option value={Role.TRAINER} className="bg-[#1a1a1a] text-white py-2">Trainer</option>
                  <option value={Role.ADMIN} className="bg-[#1a1a1a] text-white py-2">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-4 rounded-2xl bg-brand-red text-white font-bold shadow-lg shadow-brand-red/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:bg-[#ff4d4d]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
