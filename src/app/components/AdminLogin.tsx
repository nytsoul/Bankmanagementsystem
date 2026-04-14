import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { ArrowRight, KeyRound, Mail, ShieldCheck, UserCog } from 'lucide-react';
import { useBank } from '../context/BankContext';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, logout, currentUser } = useBank();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const success = await login(email, password);
    if (!success) {
      toast.error('Invalid admin credentials');
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser?.role !== 'admin') {
      logout();
      toast.error('Admin access only');
      return;
    }

    toast.success('Welcome back, admin');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_10%_15%,#fee2e2_0%,transparent_35%),radial-gradient(circle_at_90%_20%,#cffafe_0%,transparent_30%),linear-gradient(160deg,#f8fafc_0%,#f1f5f9_60%,#ecfeff_100%)] p-4 overflow-hidden">
      <div className="pointer-events-none absolute top-16 left-10 h-28 w-28 rounded-2xl border border-rose-200/60 bg-white/70 backdrop-blur-xl" />
      <div className="pointer-events-none absolute bottom-20 right-12 h-24 w-24 rounded-full border border-cyan-200/60 bg-white/70 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-rose-100">
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-rose-700 text-sm">
              <UserCog className="w-4 h-4" />
              Admin access
            </div>
            <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-600/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900">
            <span className="bg-gradient-to-r from-rose-700 via-orange-700 to-amber-700 bg-clip-text text-transparent">
              Admin Control Center
            </span>
          </h1>
          <p className="text-slate-600 mb-8">Sign in to manage customers, accounts, and security reviews.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-slate-700">Admin email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-700">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white py-3 rounded-xl hover:from-rose-700 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="mt-8 border-t border-rose-100 pt-6 text-sm text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Link to="/admin/register" className="inline-flex items-center gap-1 font-medium text-rose-700 hover:text-rose-800">
              Need admin access?
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-1 font-medium text-rose-700 hover:text-rose-800">
              Go to customer login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
