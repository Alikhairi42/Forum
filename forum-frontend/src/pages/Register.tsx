import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Loader2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);

      const axiosError = err as { response?: { data?: { message?: string } } };
      const backendMessage = axiosError.response?.data?.message;

      setError(backendMessage || 'Registration failed. Username or email may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'username', type: 'text', placeholder: 'CyberNaut42', label: 'Username', icon: <User size={15} /> },
    { name: 'email', type: 'email', placeholder: 'you@example.com', label: 'Email Address', icon: <Mail size={15} /> },
    { name: 'password', type: 'password', placeholder: '••••••••••', label: 'Password', icon: <Lock size={15} /> },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 cyber-grid"
      style={{
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(6,182,212,0.1) 0%, transparent 70%), #020409',
      }}
    >
      {/* Aurora bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="aurora2 absolute w-[700px] h-[700px] rounded-full opacity-12"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,1) 0%, transparent 70%)',
            top: '-300px', right: '-200px', filter: 'blur(100px)',
          }}
        />
        <div
          className="aurora absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,1) 0%, transparent 70%)',
            bottom: '-200px', left: '-150px', filter: 'blur(100px)',
          }}
        />
        <div
          className="aurora2 absolute w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.7) 0%, transparent 70%)',
            top: '40%', left: '50%', filter: 'blur(80px)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div
          className="glass-strong rounded-3xl overflow-hidden"
          style={{
            boxShadow: '0 0 0 1px rgba(6,182,212,0.25), 0 30px 80px rgba(0,0,0,0.7), 0 0 100px rgba(6,182,212,0.08)',
          }}
        >
          {/* Top shimmer — cyan variant */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #06b6d4, #7c3aed, #ec4899, #06b6d4)' }}
          />

          <div className="p-8">
            {/* Success state */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="inline-flex w-20 h-20 rounded-full items-center justify-center mb-5"
                  style={{
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.4)',
                    boxShadow: '0 0 30px rgba(16,185,129,0.3)',
                  }}
                >
                  <CheckCircle2 size={36} className="text-emerald-400" />
                </motion.div>
                <h2 className="text-2xl font-black text-slate-100 mb-2">Account Created!</h2>
                <p className="text-slate-500 text-sm">Redirecting you to login…</p>
                <motion.div
                  className="mt-4 h-0.5 rounded-full bg-emerald-500/30 mx-auto"
                  style={{ width: '60%' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2, ease: 'linear' }}
                />
              </motion.div>
            ) : (
              <>
                {/* Logo + heading */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: 30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-5"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)',
                      boxShadow: '0 0 30px rgba(6,182,212,0.5), 0 0 60px rgba(6,182,212,0.2)',
                    }}
                  >
                    <Zap size={28} className="text-white" />
                  </motion.div>

                  <h1 className="text-3xl font-black text-slate-100 mb-2 tracking-tight">
                    Join the Nexus
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Create your <span className="text-cyan-400 font-medium">NexusForum</span> identity
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 flex items-center gap-2"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {inputFields.map((field, i) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                      className="space-y-1.5"
                    >
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-cyan-500">{field.icon}</span>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        onChange={handleChange}
                        required
                        className="glow-input w-full rounded-xl px-4 py-3 text-sm"
                        style={{
                          // Override focus colour to cyan for register page
                        }}
                        onFocus={(el) => {
                          el.currentTarget.style.borderColor = 'rgba(6,182,212,0.8)';
                          el.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15), 0 0 20px rgba(6,182,212,0.2)';
                        }}
                        onBlur={(el) => {
                          el.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                          el.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </motion.div>
                  ))}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.4 }}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full mt-6 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)',
                      boxShadow: '0 0 20px rgba(6,182,212,0.3)',
                    }}
                    onMouseEnter={(el) => {
                      if (!loading) {
                        el.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.6), 0 0 60px rgba(124,58,237,0.3)';
                        el.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(el) => {
                      el.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.3)';
                      el.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Creating Account…</>
                    ) : (
                      <><UserPlus size={16} /><span>Create Account</span><ArrowRight size={14} /></>
                    )}
                  </motion.button>
                </form>

                {/* Footer link */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="text-center text-sm text-slate-600 mt-6"
                >
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline"
                  >
                    Sign in →
                  </Link>
                </motion.p>
              </>
            )}
          </div>
        </div>

        {/* Glow under card */}
        <div
          className="absolute -inset-x-20 -bottom-10 h-20 -z-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>
    </div>
  );
}
