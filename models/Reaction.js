const db = require('../config/database');

class Reaction {
    // Toggle reaction (like/dislike)
    static toggle(userId, targetId, targetType, reactionType) {
        return new Promise((resolve, reject) => {
            const column = targetType === 'post' ? 'post_id' : 'comment_id';
            const otherColumn = targetType === 'post' ? 'comment_id' : 'post_id';

            // Check if reaction exists
            db.get(
                `SELECT * FROM reactions WHERE user_id = ? AND ${column} = ?`,
                [userId, targetId],
                (err, existing) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (existing) {
                        if (existing.type === reactionType) {
                            // Remove reaction (toggle off)
                            db.run(
                                'DELETE FROM reactions WHERE id = ?',
                                [existing.id],
                                (err) => {
                                    if (err) reject(err);
                                    else resolve({ action: 'removed', type: reactionType });
                                }
                            );
                        } else {
                            // Update reaction type
                            db.run(
                                'UPDATE reactions SET type = ? WHERE id = ?',
                                [reactionType, existing.id],
                                (err) => {
                                    if (err) reject(err);
                                    else resolve({ action: 'updated', type: reactionType });
                                }
                            );
                        }
                    } else {
                        // Create new reaction
                        db.run(
                            `INSERT INTO reactions (user_id, ${column}, ${otherColumn}, type) VALUES (?, ?, NULL, ?)`,
                            [userId, targetId, reactionType],
                            function(err) {
                                if (err) reject(err);
                                else resolve({ action: 'created', type: reactionType });
                            }
                        );
                    }
                }
            );
        });
    }

    // Get counts
    static getCounts(targetId, targetType) {
        return new Promise((resolve, reject) => {
            const column = targetType === 'post' ? 'post_id' : 'comment_id';

            db.all(
                `SELECT type, COUNT(*) as count 
                 FROM reactions 
                 WHERE ${column} = ? 
                 GROUP BY type`,
                [targetId],
                (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const counts = { likes: 0, dislikes: 0 };
                    results.forEach(row => {
                        if (row.type === 'like') counts.likes = row.count;
                        if (row.type === 'dislike') counts.dislikes = row.count;
                    });

                    resolve(counts);
                }
            );
        });
    }

    // Get user's reaction
    static getUserReaction(userId, targetId, targetType) {
        return new Promise((resolve, reject) => {
            const column = targetType === 'post' ? 'post_id' : 'comment_id';

            db.get(
                `SELECT type FROM reactions WHERE user_id = ? AND ${column} = ?`,
                [userId, targetId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result ? result.type : null);
                }
            );
        });
    }
}

module.exports = Reaction;