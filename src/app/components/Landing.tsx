import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CreditCard,
  History,
  LayoutDashboard,
  Lock,
  Shield,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserCog,
  UserRound,
  Users,
} from 'lucide-react';

const portalCards = [
  {
    title: 'Customer Portal',
    description: 'View balances, transfer funds, schedule payments, and track spending insights.',
    badge: 'Customer',
    badgeClasses: 'bg-emerald-100 text-emerald-700',
    icon: UserRound,
    iconWrap: 'bg-emerald-600/10 text-emerald-700',
    cardBorder: 'border-emerald-100',
    cardGradient: 'from-emerald-50/80 via-white to-white',
    primary: { label: 'Customer login', to: '/login', classes: 'bg-emerald-600 hover:bg-emerald-700' },
    secondary: { label: 'Create account', to: '/register', classes: 'text-emerald-700 hover:text-emerald-800' },
  },
  {
    title: 'Admin Console',
    description: 'Manage customers, monitor risk, and oversee all transactions in one view.',
    badge: 'Admin',
    badgeClasses: 'bg-rose-100 text-rose-700',
    icon: UserCog,
    iconWrap: 'bg-rose-600/10 text-rose-700',
    cardBorder: 'border-rose-100',
    cardGradient: 'from-rose-50/80 via-white to-white',
    primary: { label: 'Admin login', to: '/admin', classes: 'bg-rose-600 hover:bg-rose-700' },
    secondary: { label: 'Admin register', to: '/admin/register', classes: 'text-rose-700 hover:text-rose-800' },
  },
];

const featureGroups = [
  {
    title: 'Customer Features',
    description: 'Everything customers need to manage money with clarity and speed.',
    accent: 'emerald',
    icon: CreditCard,
    items: [
      'Dashboard: Overview of accounts, recent transactions, and spending analysis',
      'Account Management: View and manage multiple bank accounts',
      'Transaction History: View detailed transaction records with filtering',
      'Scheduled Transactions: Set up and manage recurring or future transactions',
      'Spending Analysis: Visual charts and insights on spending patterns',
      'Transaction Panel: Quick access to transaction details',
    ],
  },
  {
    title: 'Admin Features',
    description: 'Centralized operations tooling for audit-ready oversight.',
    accent: 'rose',
    icon: Users,
    items: [
      'Admin Dashboard: System-wide analytics and monitoring',
      'Customer Management: View and manage customer accounts',
      'All Transactions: Monitor all system transactions',
      'Fraud Detection: AI-powered fraud detection and alerts',
    ],
  },
  {
    title: 'General Features',
    description: 'Security, performance, and experience are built in.',
    accent: 'sky',
    icon: Shield,
    items: [
      'Authentication: Secure login system with role-based access',
      'Protected Routes: Restricted access based on user roles',
      'Responsive Design: Works seamlessly on desktop and mobile devices',
      'Modern UI: Built with Tailwind CSS and shadcn components',
    ],
  },
];

const accentStyles = {
  emerald: {
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    iconWrap: 'bg-emerald-600/10 text-emerald-700',
  },
  rose: {
    border: 'border-rose-100',
    badge: 'bg-rose-100 text-rose-700',
    iconWrap: 'bg-rose-600/10 text-rose-700',
  },
  sky: {
    border: 'border-sky-100',
    badge: 'bg-sky-100 text-sky-700',
    iconWrap: 'bg-sky-600/10 text-sky-700',
  },
};

export function Landing() {
  return (
    <div className="min-h-screen relative bg-[radial-gradient(circle_at_20%_15%,#e0f2fe_0%,transparent_35%),radial-gradient(circle_at_80%_20%,#dcfce7_0%,transparent_35%),linear-gradient(155deg,#f8fafc_0%,#f1f5f9_55%,#ecfeff_100%)] px-6 py-12 overflow-hidden">
      <div className="pointer-events-none absolute top-16 left-10 h-28 w-28 rounded-2xl border border-sky-200/60 bg-white/70 backdrop-blur-xl" />
      <div className="pointer-events-none absolute bottom-16 right-12 h-24 w-24 rounded-full border border-emerald-200/60 bg-white/70 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-6xl mx-auto"
      >
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sky-700 text-sm">
              <Shield className="w-4 h-4" />
              SecureBank Portal
            </div>
            <h1 className="text-4xl md:text-5xl mt-6 text-slate-900 leading-tight">
              Banking operations, split by role and ready for action.
            </h1>
            <p className="text-slate-600 mt-4 max-w-2xl text-lg">
              A modern, full-featured bank management experience with dedicated dashboards for customers and admins.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 border border-sky-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Real-time account visibility
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 border border-emerald-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
                <Lock className="w-4 h-4 text-emerald-600" />
                Role-based security
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 border border-amber-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
                <Smartphone className="w-4 h-4 text-amber-600" />
                Mobile-ready layouts
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-600 via-emerald-500 to-cyan-600 px-5 py-4 text-white shadow-lg">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-sm">Fraud detection and monitoring built in</span>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          {portalCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className={`rounded-2xl border ${card.cardBorder} bg-gradient-to-br ${card.cardGradient} p-6 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`h-12 w-12 rounded-2xl ${card.iconWrap} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs uppercase tracking-widest ${card.badgeClasses}`}>{card.badge}</span>
                </div>
                <h2 className="text-2xl text-slate-900">{card.title}</h2>
                <p className="text-slate-600 mt-2">{card.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <Link
                    to={card.primary.to}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-white transition-colors ${card.primary.classes}`}
                  >
                    {card.primary.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={card.secondary.to}
                    className={`inline-flex items-center gap-2 font-medium ${card.secondary.classes}`}
                  >
                    {card.secondary.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featureGroups.map((group) => {
              const Icon = group.icon;
              const styles = accentStyles[group.accent as keyof typeof accentStyles];
              return (
                <div
                  key={group.title}
                  className={`rounded-2xl border ${styles.border} bg-white/85 backdrop-blur-xl p-6 shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-11 w-11 rounded-2xl ${styles.iconWrap} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs uppercase tracking-widest ${styles.badge}`}>{group.title}</span>
                  </div>
                  <p className="text-slate-600 mb-4">{group.description}</p>
                  <ul className="space-y-3 text-sm text-slate-700">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="rounded-2xl border border-sky-100 bg-white/80 p-5 shadow-sm flex items-start gap-3">
            <LayoutDashboard className="w-5 h-5 text-sky-600" />
            Role-specific dashboards for customers and admins.
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Insights for spending analysis and financial forecasting.
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm flex items-start gap-3">
            <History className="w-5 h-5 text-amber-600" />
            Full transaction history with filters and status tracking.
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm flex items-start gap-3">
            <Users className="w-5 h-5 text-rose-600" />
            Manage customer accounts with verified workflows.
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-white/80 p-5 shadow-sm flex items-start gap-3">
            <Calendar className="w-5 h-5 text-cyan-600" />
            Schedule recurring payments and future transfers.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-600" />
            Review fraud signals and flagged activity quickly.
          </div>
        </section>
      </motion.div>
    </div>
  );
}
