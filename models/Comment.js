const db = require('../config/database');

class Comment {
    // Create comment
    static create(content, postId, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO comments (content, post_id, user_id) VALUES (?, ?, ?)',
                [content, postId, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, content, postId, userId });
                }
            );
        });
    }

    // Get comments by post
    static getByPost(postId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    c.*,
                    u.username,
                    (SELECT COUNT(*) FROM reactions WHERE comment_id = c.id AND type = 'like') as likes,
                    (SELECT COUNT(*) FROM reactions WHERE comment_id = c.id AND type = 'dislike') as dislikes
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at DESC
            `, [postId], (err, comments) => {
                if (err) reject(err);
                else resolve(comments);
            });
        });
    }

    // Delete comment
    static delete(commentId, userId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM comments WHERE id = ? AND user_id = ?',
                [commentId, userId],
                (err, comment) => {
                    if (err || !comment) {
                        reject(new Error('Comment not found or unauthorized'));
                    } else {
                        // Delete reactions first
                        db.run('DELETE FROM reactions WHERE comment_id = ?', [commentId], (err) => {
                            if (err) reject(err);
                            
                            // Delete comment
                            db.run('DELETE FROM comments WHERE id = ?', [commentId], (err) => {
                                if (err) reject(err);
                                else resolve({ message: 'Comment deleted' });
                            });
                        });
                    }
                }
            );
        });
    }
}

module.exports = Comment;