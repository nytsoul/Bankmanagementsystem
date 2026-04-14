import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import { ArrowRight, Building2, KeyRound, LogIn, Mail, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useBank();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      toast.success('Login successful');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_10%_20%,#dcfce7_0%,transparent_35%),radial-gradient(circle_at_90%_10%,#cffafe_0%,transparent_30%),linear-gradient(160deg,#ecfeff_0%,#f8fafc_60%,#e6fffa_100%)] p-4 overflow-hidden">
      <div className="pointer-events-none absolute top-20 left-8 h-28 w-28 rounded-2xl border border-emerald-200/50 bg-white/60 backdrop-blur-xl" />
      <div className="pointer-events-none absolute bottom-16 right-8 h-24 w-24 rounded-full border border-cyan-200/50 bg-white/60 backdrop-blur-xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-emerald-100">
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 text-sm">
              <Building2 className="w-4 h-4" />
              Safe digital banking
            </div>
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-600/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900">
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
              SecureBank
            </span>
          </h1>
          <p className="text-slate-600 mb-8">Log in to your dashboard and manage accounts in real time.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-slate-700">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/75 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="you@example.com"
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
                  className="w-full pl-11 pr-4 py-3 bg-white/75 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </motion.button>
          </form>

          <div className="mt-8 border-t border-emerald-100 pt-6 text-sm text-slate-600">
            New to SecureBank?
            <Link to="/register" className="ml-2 inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800">
              Create account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
