import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, KeyRound, Mail, ShieldCheck, User, UserCog } from 'lucide-react';
import { useBank } from '../context/BankContext';

export function AdminRegister() {
  const navigate = useNavigate();
  const { registerAdmin } = useBank();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminRegistrationKey, setAdminRegistrationKey] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!adminRegistrationKey.trim()) {
      toast.error('Admin access code is required');
      return;
    }

    const success = await registerAdmin({
      firstName,
      lastName,
      email,
      password,
      phoneNumber: phoneNumber || undefined,
      adminRegistrationKey,
    });

    if (!success) {
      toast.error('Admin registration failed. Check access code or email.');
      return;
    }

    toast.success('Admin account created');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(circle_at_85%_20%,#ffe4e6_0%,transparent_35%),radial-gradient(circle_at_10%_80%,#fde68a_0%,transparent_35%),linear-gradient(150deg,#fff7ed_0%,#f8fafc_60%,#ecfeff_100%)] p-4 overflow-hidden">
      <div className="pointer-events-none absolute top-12 right-12 h-28 w-28 rounded-full border border-rose-200/70 bg-white/70 backdrop-blur-xl" />
      <div className="pointer-events-none absolute bottom-16 left-10 h-24 w-24 rounded-2xl border border-amber-200/60 bg-white/70 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-rose-100">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-rose-700 text-sm">
              <UserCog className="w-4 h-4" />
              Admin onboarding
            </div>
            <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-600/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900">
            <span className="bg-gradient-to-r from-rose-700 via-orange-700 to-amber-700 bg-clip-text text-transparent">
              Create admin profile
            </span>
          </h1>
          <p className="text-slate-600 mb-8">Use your admin access code to unlock management tools.</p>

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
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
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
                  className="w-full px-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="Johnson"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm mb-2 text-slate-700">Phone (optional)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
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
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
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
                  className="w-full px-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="Repeat password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-700">Admin access code</label>
              <input
                type="password"
                value={adminRegistrationKey}
                onChange={(e) => setAdminRegistrationKey(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                placeholder="Enter secure access code"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white py-3 rounded-xl hover:from-rose-700 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
            >
              Create Admin Account
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="mt-7 border-t border-rose-100 pt-6 text-sm text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Link to="/admin" className="inline-flex items-center gap-1 font-medium text-rose-700 hover:text-rose-800">
              <ArrowLeft className="w-4 h-4" />
              Back to admin login
            </Link>
            <Link to="/login" className="inline-flex items-center gap-1 font-medium text-rose-700 hover:text-rose-800">
              Customer login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
