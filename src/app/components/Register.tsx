import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Building2, KeyRound, Mail, Shield, User } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_90%_20%,#bae6fd_0%,transparent_30%),radial-gradient(circle_at_10%_80%,#bbf7d0_0%,transparent_35%),linear-gradient(150deg,#f0fdfa_0%,#f8fafc_55%,#ecfeff_100%)] p-4 overflow-hidden">
      <div className="pointer-events-none absolute top-14 right-12 h-28 w-28 rounded-full border border-cyan-200/70 bg-white/60 backdrop-blur-xl" />
      <div className="pointer-events-none absolute bottom-20 left-8 h-24 w-24 rounded-2xl border border-emerald-200/60 bg-white/60 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/82 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-cyan-100">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-cyan-800 text-sm">
              <Building2 className="w-4 h-4" />
              Open your account
            </div>
            <div className="bg-cyan-600 p-3 rounded-2xl shadow-lg shadow-cyan-600/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900">
            <span className="bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-700 bg-clip-text text-transparent">
              Create your profile
            </span>
          </h1>
          <p className="text-slate-600 mb-8">Register now to access transactions, analytics, and account controls.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-slate-700">First name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
                  className="w-full px-4 py-3 bg-white/80 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
                  className="w-full px-4 py-3 bg-white/80 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
                  className="w-full px-4 py-3 bg-white/80 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white py-3 rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="mt-7 border-t border-cyan-100 pt-6 text-sm text-slate-600">
            Already registered?
            <Link to="/" className="ml-2 inline-flex items-center gap-1 font-medium text-cyan-700 hover:text-cyan-800">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
