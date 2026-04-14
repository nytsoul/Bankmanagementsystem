import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import { ArrowRight, Building2, CheckCircle2, KeyRound, LogIn, Mail, Shield } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_12%_18%,#bbf7d0_0%,transparent_35%),radial-gradient(circle_at_88%_14%,#bae6fd_0%,transparent_32%),linear-gradient(160deg,#ecfeff_0%,#f8fafc_58%,#e6fffa_100%)] p-4 overflow-hidden">
      <div className="pointer-events-none absolute top-16 left-10 h-28 w-28 rounded-2xl border border-emerald-200/50 bg-white/60 backdrop-blur-xl" />
      <div className="pointer-events-none absolute bottom-16 right-10 h-24 w-24 rounded-full border border-cyan-200/50 bg-white/60 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-5xl"
      >
        <div className="grid gap-6 rounded-3xl border border-emerald-100 bg-white/82 p-6 shadow-2xl backdrop-blur-xl md:grid-cols-[1.1fr_1fr] md:p-10">
          <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white md:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">SecureBank</p>
                <p className="text-2xl font-semibold">Welcome back</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-sm text-white/90">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4" />
                <span>Instant balance insights and account health</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4" />
                <span>Smart alerts for every transfer or withdrawal</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4" />
                <span>Private, encrypted access to your portfolio</span>
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-white/15 p-4 text-sm text-white/90">
              <div className="flex items-center gap-2 text-white/80">
                <Building2 className="h-4 w-4" />
                Trusted by modern banking teams
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-white/80 p-6 md:p-8">
            <h1 className="text-3xl text-slate-900">Sign in</h1>
            <p className="mt-2 text-sm text-slate-600">Use your verified email to continue.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm mb-2 text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/85 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
                    className="w-full pl-11 pr-4 py-3 bg-white/85 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </motion.button>
            </form>

            <div className="mt-6 text-sm text-slate-600">
              New to SecureBank?
              <Link to="/register" className="ml-2 inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800">
                Create account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
