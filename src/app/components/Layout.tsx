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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-800">SecureBank</h2>
            <p className="text-sm text-gray-500 mt-1">
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
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="mb-4 px-4">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="text-sm text-gray-800">{currentUser?.username}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.aside>

        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
