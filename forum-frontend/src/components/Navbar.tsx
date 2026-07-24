import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LogIn, UserPlus, Menu, X, MessageSquare } from 'lucide-react';
import forumLogo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinks = isLoggedIn
    ? [{ label: 'Forum', to: '/', icon: <MessageSquare size={15} /> }]
    : [
        { label: 'Login', to: '/login', icon: <LogIn size={15} /> },
        { label: 'Register', to: '/register', icon: <UserPlus size={15} /> },
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        {/* Floating pill container */}
        <div className="max-w-5xl mx-auto px-4">
          <div
            className="glass rounded-2xl px-5 py-3 flex items-center justify-between"
            style={{
              boxShadow: '0 0 0 1px rgba(124,58,237,0.25), 0 8px 32px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.08)',
            }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.img
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
                src={forumLogo}
                alt="NexusForum logo"
                className="w-11 h-11 md:w-12 md:h-12 object-contain rounded-xl bg-slate-950/60 p-1 ring-1 ring-white/10"
              />
              <span className="font-bold text-lg tracking-tight gradient-text-purple">
                NexusForum
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.to
                        ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </motion.div>
                </Link>
              ))}

              {isLoggedIn && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200"
                >
                  <LogOut size={15} />
                  Logout
                </motion.button>
              )}
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="mt-2 glass rounded-2xl px-4 py-3 flex flex-col gap-1"
                style={{ boxShadow: '0 0 0 1px rgba(124,58,237,0.25), 0 8px 32px rgba(0,0,0,0.5)' }}
              >
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-white/5 transition-colors">
                      {link.icon}
                      {link.label}
                    </div>
                  </Link>
                ))}
                {isLoggedIn && (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
