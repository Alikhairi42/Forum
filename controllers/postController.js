const Post = require('../models/Post');

// Show create post form
exports.showCreate = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('create-post', { 
        title: 'Create Post',
        error: null 
    });
};

// Handle create post
exports.create = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
        return res.render('create-post', {
            title: 'Create Post',
            error: 'Title and content are required'
        });
    }

    if (title.length < 3) {
        return res.render('create-post', {
            title: 'Create Post',
            error: 'Title must be at least 3 characters'
        });
    }

    if (content.length < 10) {
        return res.render('create-post', {
            title: 'Create Post',
            error: 'Content must be at least 10 characters'
        });
    }

    try {
        const post = await Post.create(title, content, req.session.user.id);
        res.redirect(`/posts/${post.id}`);
    } catch (err) {
        console.error('Post creation error:', err);
        res.render('create-post', {
            title: 'Create Post',
            error: 'Failed to create post'
        });
    }
};

// Show all posts (home page)
exports.index = async (req, res) => {
    try {
        const posts = await Post.getAll();
        res.render('home', {
            title: 'Forum Home',
            message: 'Welcome to the forum!',
            posts: posts
        });
    } catch (err) {
        console.error('Get posts error:', err);
        res.render('home', {
            title: 'Forum Home',
            message: 'Welcome to the forum!',
            posts: []
        });
    }
};

// Show single post
exports.show = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.getById(postId);
        
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Get comments (we'll create this next)
        const Comment = require('../models/Comment');
        const comments = await Comment.getByPost(postId);

        // Check if current user has reacted
        let userReaction = null;
        if (req.session.user) {
            const Reaction = require('../models/Reaction');
            userReaction = await Reaction.getUserReaction(req.session.user.id, postId, 'post');
        }

        res.render('post', {
            title: post.title,
            post: post,
            comments: comments,
            userReaction: userReaction
        });
    } catch (err) {
        console.error('Get post error:', err);
        res.status(500).send('Error loading post');
    }
};

// Delete post
exports.delete = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const postId = req.params.id;

    try {
        await Post.delete(postId, req.session.user.id);
        res.redirect('/');
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).send('Failed to delete post');
    }
};

// Show user's posts
exports.myPosts = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    try {
        const posts = await Post.getByUser(req.session.user.id);
        res.render('my-posts', {
            title: 'My Posts',
            posts: posts
        });
    } catch (err) {
        console.error('Get user posts error:', err);
        res.render('my-posts', {
            title: 'My Posts',
            posts: []
        });
    }
};