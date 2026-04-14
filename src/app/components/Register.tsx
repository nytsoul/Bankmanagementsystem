import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, KeyRound, Mail, Shield, User } from 'lucide-react';
import { useBank } from '../context/BankContext';

export function Register() {
  const navigate = useNavigate();
  const { register } = useBank();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const success = await register({
      firstName,
      lastName,
      email,
      password,
      phoneNumber: phoneNumber || undefined,
    });

    if (!success) {
      toast.error('Registration failed. Email may already be in use.');
      return;
    }

    toast.success('Account created successfully');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_86%_18%,#bae6fd_0%,transparent_32%),radial-gradient(circle_at_14%_80%,#bbf7d0_0%,transparent_38%),linear-gradient(150deg,#f0fdfa_0%,#f8fafc_55%,#ecfeff_100%)] p-4 overflow-hidden">
      <div className="pointer-events-none absolute top-16 right-10 h-28 w-28 rounded-full border border-cyan-200/70 bg-white/60 backdrop-blur-xl" />
      <div className="pointer-events-none absolute bottom-16 left-10 h-24 w-24 rounded-2xl border border-emerald-200/60 bg-white/60 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-5xl"
      >
        <div className="grid gap-6 rounded-3xl border border-cyan-100 bg-white/85 p-6 shadow-2xl backdrop-blur-xl md:grid-cols-[1fr_1.1fr] md:p-10">
          <div className="flex h-full flex-col justify-between rounded-2xl bg-white/70 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Open account</p>
                <p className="text-2xl font-semibold text-slate-900">Grow with clarity</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Unified dashboard for cards, savings, and transfers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Clear analytics for everyday spending habits</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Secure onboarding with full identity coverage</span>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-800">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Join thousands of customers managing money in minutes.
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-6 md:p-8">
            <h1 className="text-3xl text-slate-900">Create your profile</h1>
            <p className="mt-2 text-sm text-slate-600">Set up your SecureBank access in under two minutes.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-slate-700">First name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/85 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="Ava"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-slate-700">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/85 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Johnson"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/85 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-slate-700">Phone (optional)</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white/85 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-slate-700">Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/85 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="At least 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-slate-700">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/85 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Repeat password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>

            <div className="mt-6 text-sm text-slate-600">
              Already registered?
              <Link to="/login" className="ml-2 inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
