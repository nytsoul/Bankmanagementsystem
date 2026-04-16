import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
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
  Menu,
  X,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';
import { useState, useRef } from 'react';

const portalCards = [
  {
    title: 'Customer Portal',
    description: 'Experience seamless banking. View balances, transfer funds, and track insights in real-time.',
    badge: 'Standard Access',
    badgeClasses: 'bg-emerald-100 text-emerald-700',
    icon: UserRound,
    iconWrap: 'bg-emerald-600/10 text-emerald-700',
    cardBorder: 'border-emerald-100',
    cardGradient: 'from-emerald-50/80 via-white to-white',
    primary: { label: 'Customer Login', to: '/login', classes: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' },
    secondary: { label: 'Open Account', to: '/register', classes: 'text-emerald-700 hover:text-emerald-800' },
  },
  {
    title: 'Admin Console',
    description: 'Advanced oversight for banking professionals. Manage users and monitor risk signals.',
    badge: 'Secure Access',
    badgeClasses: 'bg-rose-100 text-rose-700',
    icon: UserCog,
    iconWrap: 'bg-rose-600/10 text-rose-700',
    cardBorder: 'border-rose-100',
    cardGradient: 'from-rose-50/80 via-white to-white',
    primary: { label: 'Admin Login', to: '/admin', classes: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' },
    secondary: { label: 'Register Admin', to: '/admin/register', classes: 'text-rose-700 hover:text-rose-800' },
  },
];

const bentoFeatures = [
  {
    title: 'Real-time Analytics',
    description: 'Monitor your financial health with live data streaming directly to your dashboard.',
    icon: Activity,
    color: 'sky',
    span: 'col-span-2 row-span-1',
  },
  {
    title: 'Bank-Grade Security',
    description: 'End-to-end encryption for every transaction.',
    icon: Shield,
    color: 'emerald',
    span: 'col-span-1 row-span-2',
  },
  {
    title: 'Smart Spending',
    description: 'AI-powered insights to help you save smarter.',
    icon: Zap,
    color: 'amber',
    span: 'col-span-1 row-span-1',
  },
  {
    title: 'Mobile First',
    description: 'Banking on the go with our fully responsive interface.',
    icon: Smartphone,
    color: 'indigo',
    span: 'col-span-1 row-span-1',
  },
];

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200 group-hover:rotate-12 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-sky-700">SecureBank</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
          <a href="#portals" className="hover:text-teal-600 transition-colors">Portals</a>
          <a href="#security" className="hover:text-teal-600 transition-colors">Security</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 flex items-center gap-2 group">
            Get Started
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="min-h-screen relative bg-slate-50 overflow-x-hidden selection:bg-teal-100 selection:text-teal-900">
      <Nav />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          style={{ y: blobY1 }}
          className="absolute -top-[10%] -left-[5%] w-[40%] h-[60%] rounded-full bg-teal-100/40 blur-[120px]" 
        />
        <motion.div 
          style={{ y: blobY2 }}
          className="absolute top-[30%] -right-[10%] w-[50%] h-[70%] rounded-full bg-sky-100/40 blur-[120px]" 
        />
        <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[40%] rounded-full bg-emerald-100/30 blur-[100px]" />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-[1440px] mx-auto text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-wider uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                The Future of Personal Banking
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
                Banking for <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600">the Digital Age.</span>
              </h1>
              <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience high-performance bank management with role-based security, real-time insights, and a seamless interface.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
                  Open a free account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all text-center">
                  Explore Features
                </a>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 grayscale opacity-50">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Lock className="w-5 h-5" /> SECURE
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Activity className="w-5 h-5" /> LIVE
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Shield className="w-5 h-5" /> TRUSTED
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white shadow-2xl rounded-[2.5rem] border border-slate-200 p-4 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="bg-slate-50 rounded-[2rem] p-8 aspect-[4/3] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">Balance</p>
                        <h3 className="text-4xl font-bold text-slate-900 mt-1">$48,290.45</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-teal-600/10 flex items-center justify-center text-teal-600">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">Income</p>
                        <p className="text-emerald-600 font-bold">$12,400</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">Expenses</p>
                        <p className="text-rose-600 font-bold">$3,150</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-slate-200 rounded-full mb-2" />
                        <div className="h-2 w-16 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Uptime', val: '99.99%', sub: 'SLA Guaranteed' },
              { label: 'Security', val: '256-bit', sub: 'AES Encryption' },
              { label: 'Users', val: '100k+', sub: 'Active Accounts' },
              { label: 'Support', val: '24/7', sub: 'Instant Response' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                <h4 className="text-3xl font-bold text-slate-900">{stat.val}</h4>
                <p className="text-teal-600 text-xs font-bold mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Portals Section */}
        <section id="portals" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Experience</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Select the portal that fits your needs. Each experience is tailored for maximum efficiency and role-specific workflows.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portalCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    whileHover={{ y: -8 }}
                    className={`group rounded-3xl border ${card.cardBorder} bg-white p-8 shadow-sm hover:shadow-2xl transition-all duration-500`}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className={`h-16 w-16 rounded-2xl ${card.iconWrap} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${card.badgeClasses}`}>
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{card.title}</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">{card.description}</p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <Link
                        to={card.primary.to}
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-white font-bold transition-all shadow-xl group-hover:scale-[1.02] ${card.primary.classes}`}
                      >
                        {card.primary.label}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to={card.secondary.to}
                        className={`inline-flex items-center justify-center gap-2 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors ${card.secondary.classes}`}
                      >
                        {card.secondary.label}
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bento Features */}
        <section id="features" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500 blur-[150px]" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h2 className="text-4xl font-bold mb-4">Engineered for Excellence</h2>
                <p className="text-slate-400 max-w-xl">
                  Built on a foundation of security and speed. Our platform delivers features that define the future of finance.
                </p>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
                v1.2.0 Stable Release
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">
              {bentoFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${feature.span} p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group relative overflow-hidden`}
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-4">
                        <Icon className="w-8 h-8 text-teal-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="mt-auto">
                        <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-6 h-6 text-teal-500/50" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24 px-6 bg-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_0%,transparent_50%)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to take control of your finances?</h2>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-teal-600 font-bold hover:bg-teal-50 transition-all shadow-2xl text-lg hover:scale-105">
              Secure your account now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-slate-900">SecureBank</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering individuals and businesses with advanced banking technology. Security and transparency in every transaction.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h5 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Platform</h5>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Integrations</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Company</h5>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-teal-600 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Compliance</a></li>
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Support</h5>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-teal-600 transition-colors">Status</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs">© 2026 SecureBank Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 grayscale opacity-50 text-slate-400">
              <Lock className="w-4 h-4" />
              <Shield className="w-4 h-4" />
              <Activity className="w-4 h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
