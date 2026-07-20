const db = require('../config/database');

class Post {
    // Create new post
    static create(title, content, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
                [title, content, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, title, content, userId });
                }
            );
        });
    }

    // Get all posts with user info
    static getAll() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    p.*,
                    u.username,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'like') as likes,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'dislike') as dislikes
                FROM posts p
                JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
            `, (err, posts) => {
                if (err) reject(err);
                else resolve(posts);
            });
        });
    }

    // Get single post by ID
    static getById(postId) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    p.*,
                    u.username,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'like') as likes,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'dislike') as dislikes
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = ?
            `, [postId], (err, post) => {
                if (err) reject(err);
                else resolve(post);
            });
        });
    }

    // Get posts by user
    static getByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    p.*,
                    u.username,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'like') as likes,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'dislike') as dislikes
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.user_id = ?
                ORDER BY p.created_at DESC
            `, [userId], (err, posts) => {
                if (err) reject(err);
                else resolve(posts);
            });
        });
    }

    // Delete post
    static delete(postId, userId) {
        return new Promise((resolve, reject) => {
            // First check if user owns the post
            db.get(
                'SELECT * FROM posts WHERE id = ? AND user_id = ?',
                [postId, userId],
                (err, post) => {
                    if (err || !post) {
                        reject(new Error('Post not found or unauthorized'));
                    } else {
                        // Delete comments first (foreign key)
                        db.run('DELETE FROM comments WHERE post_id = ?', [postId], (err) => {
                            if (err) reject(err);
                            
                            // Delete reactions
                            db.run('DELETE FROM reactions WHERE post_id = ?', [postId], (err) => {
                                if (err) reject(err);
                                
                                // Delete post
                                db.run('DELETE FROM posts WHERE id = ?', [postId], (err) => {
                                    if (err) reject(err);
                                    else resolve({ message: 'Post deleted' });
                                });
                            });
                        });
                    }
                }
            );
        });
    }
}

module.exports = Post;