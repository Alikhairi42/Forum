const Comment = require('../models/Comment');

// Create comment
exports.create = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    const { content, post_id } = req.body;

    if (!content || !post_id) {
        return res.status(400).send('Content and post_id required');
    }

    if (content.length < 1) {
        return res.status(400).send('Comment cannot be empty');
    }

    try {
        await Comment.create(content, post_id, req.session.user.id);
        res.redirect(`/posts/${post_id}`);
    } catch (err) {
        console.error('Comment creation error:', err);
        res.status(500).send('Failed to create comment');
    }
};

// Delete comment
exports.delete = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const commentId = req.params.id;

    try {
        await Comment.delete(commentId, req.session.user.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete comment error:', err);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};