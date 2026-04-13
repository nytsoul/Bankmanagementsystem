import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useBank } from '../context/BankContext';
import {
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  History,
  Settings,
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, logout } = useBank();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = currentUser?.role === 'admin'
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: CreditCard, label: 'Accounts', path: '/accounts' },
        { icon: History, label: 'Transactions', path: '/transactions' },
        { icon: AlertTriangle, label: 'Fraud Detection', path: '/fraud' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: CreditCard, label: 'My Accounts', path: '/my-accounts' },
        { icon: ArrowLeftRight, label: 'Transfer', path: '/transfer' },
        { icon: History, label: 'History', path: '/history' },
        { icon: Calendar, label: 'Scheduled', path: '/scheduled' },
        { icon: TrendingUp, label: 'Analysis', path: '/analysis' },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      <div className="flex">
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="w-64 bg-white/85 backdrop-blur-xl border-r border-sky-100 min-h-screen fixed left-0 top-0"
        >
          <div className="p-6 border-b border-sky-100">
            <h2 className="text-xl text-slate-900">SecureBank</h2>
            <p className="text-sm text-slate-500 mt-1">
              {currentUser?.role === 'admin' ? 'Admin Panel' : 'Customer Portal'}
            </p>
          </div>

          <nav className="p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sky-100">
            <div className="mb-4 px-4">
              <p className="text-sm text-slate-600">Logged in as</p>
              <p className="text-sm text-slate-900">{currentUser?.username}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.aside>

        <main className="flex-1 ml-64 p-8 relative">
          <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-gradient-to-br from-sky-200/50 to-emerald-200/50 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-200/40 to-sky-200/40 blur-3xl" />
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
