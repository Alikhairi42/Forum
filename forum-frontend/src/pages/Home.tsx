import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Sparkles, Globe, Loader2, Rocket } from 'lucide-react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import forumLogo from '../assets/logo.png';

interface Post {
  id: number;
  title: string;
  content: string;
  user: { username: string };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formFocused, setFormFocused] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/posts', newPost);
      setNewPost({ title: '', content: '' });
      setFormFocused(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Are you logged in?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen cyber-grid"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.15) 0%, transparent 60%), #020409' }}
    >
      {/* Aurora blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="aurora absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,1) 0%, transparent 70%)',
            top: '-200px',
            left: '-100px',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="aurora2 absolute w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,1) 0%, transparent 70%)',
            top: '50%',
            right: '-150px',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="aurora absolute w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.8) 0%, transparent 70%)',
            bottom: '-100px',
            left: '30%',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-32 pb-20">
        {/* ── Hero Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-wider uppercase"
            style={{
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.35)',
              color: '#a78bfa',
            }}
          >
            <img
              src={forumLogo}
              alt="NexusForum logo"
              className="w-11 h-11 md:w-12 md:h-12 object-contain rounded-lg bg-slate-950/60 p-1 ring-1 ring-white/10"
            />
            <span>Live Community · Global Forum</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-5 leading-none">
            <span className="text-slate-100">Welcome to</span>
            <br />
            <span className="gradient-text neon-text">NexusForum</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
            A <span className="text-violet-400 font-medium">next-generation</span> community where ideas collide, 
            conversations ignite, and minds connect across the digital frontier.
          </p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            {[
              { icon: <Globe size={14} />, label: `${posts.length} Posts` },
              { icon: <Sparkles size={14} />, label: 'Live Updates' },
              { icon: <Rocket size={14} />, label: 'Cyber-Speed' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5 text-slate-600 text-xs">
                <span className="text-violet-500">{stat.icon}</span>
                {stat.label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Create Post Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-10"
        >
          <motion.div
            animate={formFocused ? { scale: 1.01 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl overflow-hidden"
            style={{
              boxShadow: formFocused
                ? '0 0 0 1px rgba(124,58,237,0.5), 0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.12)'
                : '0 0 0 1px rgba(124,58,237,0.2), 0 8px 32px rgba(0,0,0,0.4)',
              transition: 'box-shadow 0.4s ease',
            }}
          >
            {/* Form header */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
              >
                <PenLine size={14} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Create a Post</h3>
                <p className="text-xs text-slate-600">Share your thoughts with the community</p>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  placeholder="Give your post a compelling title…"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  onFocus={() => setFormFocused(true)}
                  onBlur={() => setFormFocused(false)}
                  required
                  className="glow-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Content</label>
                <textarea
                  placeholder="What's on your mind? Share your ideas, questions, or discoveries…"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  onFocus={() => setFormFocused(true)}
                  onBlur={() => setFormFocused(false)}
                  required
                  rows={4}
                  className="glow-input w-full rounded-xl px-4 py-3 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.03 }}
                  whileTap={{ scale: submitting ? 1 : 0.97 }}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Posting…
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} className="relative z-10" />
                      <span className="relative z-10">Launch Post</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #7c3aed, #38bdf8)' }} />
            <h2 className="text-base font-semibold text-slate-300">Latest Posts</h2>
          </div>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.4), transparent)' }} />
          {!loading && (
            <span className="text-xs text-slate-600 font-mono">{posts.length} threads</span>
          )}
        </motion.div>

        {/* ── Posts list ── */}
        {loading ? (
          /* Skeleton loaders */
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 shimmer"
                style={{ boxShadow: '0 0 0 1px rgba(124,58,237,0.1)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/5 rounded-lg w-3/4" />
                    <div className="h-3 bg-white/5 rounded-lg w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded-lg w-full" />
                  <div className="h-3 bg-white/5 rounded-lg w-5/6" />
                  <div className="h-3 bg-white/5 rounded-lg w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🌌</div>
            <p className="text-slate-500 text-lg font-medium">The void awaits your first post.</p>
            <p className="text-slate-700 text-sm mt-2">Be the pioneer — launch the first thread!</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="space-y-4">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} onRefresh={fetchPosts} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
