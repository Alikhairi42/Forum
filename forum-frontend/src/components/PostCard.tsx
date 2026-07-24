import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Trash2, Send, ChevronDown, User } from 'lucide-react';
import api from '../services/api';

interface Post {
  id: number;
  title: string;
  content: string;
  user: { username: string };
}

interface Comment {
  id: number;
  content: string;
  user?: { username: string };
}

interface PostCardProps {
  post: Post;
  onRefresh: () => void;
  index?: number;
}

export default function PostCard({ post, onRefresh, index = 0 }: PostCardProps) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 3D tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchReacts();
    fetchComments();
  }, [post.id]);

  const fetchReacts = async () => {
    try {
      const response = await api.get(`/reacts/${post.id}`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error('Error fetching reacts:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${post.id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      setLikeAnimating(true);
      await api.post('/reacts', { postId: post.id, type: 'LIKE' });
      fetchReacts();
      setTimeout(() => setLikeAnimating(false), 600);
    } catch (error) {
      console.error('Like error:', error);
      alert('Please login to like posts!');
      setLikeAnimating(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/comments', { postId: post.id, content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Comment error:', error);
      alert('Please login to comment!');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        fetchComments();
      } catch (error) {
        console.error('Delete comment error:', error);
        alert('You can only delete your OWN comments!');
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        await api.delete(`/posts/${post.id}`);
        onRefresh();
      } catch (error) {
        console.error('Delete error:', error);
        alert('You can only delete your OWN posts!');
        setIsDeleting(false);
      }
    }
  };

  // 3D Tilt handlers
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  // Colour palette cycling for avatar
  const avatarColors = [
    'from-violet-600 to-indigo-600',
    'from-cyan-500 to-blue-600',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
  ];
  const avatarColor = avatarColors[index % avatarColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        perspective: '1000px',
        opacity: isDeleting ? 0.4 : 1,
        transition: 'opacity 0.3s',
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass rounded-2xl overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 0 0 1px rgba(124,58,237,0.5), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(124,58,237,0.15)'
            : '0 0 0 1px rgba(124,58,237,0.15), 0 8px 32px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Shimmer line at top */}
        <div
          className="h-0.5 w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), rgba(56,189,248,0.8), transparent)' }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}
              >
                {post.user?.username?.[0]?.toUpperCase() || <User size={16} />}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-slate-100 text-lg leading-tight line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <span className="text-violet-400 font-medium">@{post.user?.username}</span>
                </p>
              </div>
            </div>

            {/* Delete button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200"
              title="Delete post"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>

          {/* Content */}
          <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-4">
            {post.content}
          </p>

          {/* Divider */}
          <div className="h-px w-full mb-4" style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.3), transparent)' }} />

          {/* Action bar */}
          <div className="flex items-center gap-3">
            {/* Like button */}
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
              className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border overflow-hidden"
              style={{
                background: likeAnimating ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: likeAnimating ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.08)',
                color: likeAnimating ? '#f472b6' : '#94a3b8',
              }}
            >
              <motion.div
                animate={likeAnimating ? { scale: [1, 1.5, 0.9, 1.2, 1], rotate: [0, -15, 15, -5, 0] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Heart
                  size={15}
                  fill={likeAnimating ? 'currentColor' : 'none'}
                  className="transition-colors duration-200"
                />
              </motion.div>
              <span>{likes}</span>

              {/* Ripple particles on like */}
              <AnimatePresence>
                {likeAnimating && (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-pink-400 pointer-events-none"
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{
                          opacity: 0,
                          x: (Math.random() - 0.5) * 40,
                          y: (Math.random() - 0.5) * 40,
                          scale: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Comments toggle */}
            <motion.button
              onClick={() => setShowComments(!showComments)}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200"
              style={{
                background: showComments ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)',
                borderColor: showComments ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)',
                color: showComments ? '#38bdf8' : '#94a3b8',
              }}
            >
              <MessageCircle size={15} />
              <span>{comments.length}</span>
              <motion.div animate={{ rotate: showComments ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={13} />
              </motion.div>
            </motion.button>
          </div>

          {/* Comments section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 rounded-xl p-4 space-y-3"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {/* Comment list */}
                  {comments.length === 0 ? (
                    <p className="text-slate-600 text-xs text-center py-2">No comments yet. Be the first!</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {comments.map((c, ci) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ci * 0.05 }}
                          className="flex items-start gap-2 group/comment"
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-300">
                            {c.user?.username?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="rounded-lg px-3 py-2"
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                              <span className="text-violet-400 text-xs font-semibold">@{c.user?.username} </span>
                              <span className="text-slate-300 text-xs">{c.content}</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleDeleteComment(c.id)}
                            className="opacity-0 group-hover/comment:opacity-100 transition-opacity p-1 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                          >
                            <Trash2 size={12} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Add comment form */}
                  <form onSubmit={handleAddComment} className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment…"
                      required
                      className="glow-input flex-1 rounded-xl px-3 py-2 text-sm"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="btn-primary w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                    >
                      <Send size={14} className="text-white relative z-10" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
