const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    // Create new user
    static async create(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            try {
                
                // Insert into database
                db.run(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [username, email, hashedPassword],
                    function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ id: this.lastID, username, email });
                        }
                    }
                );
            } catch (err) {
                reject(err);
            }
        });
    }

    // Find user by email
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (err, user) => {
                    if (err) reject(err);
                    else resolve(user);
                }
            );
        });
    }

    // Find user by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, email, created_at FROM users WHERE id = ?',
                [id],
                (err, user) => {
                    if (err) reject(err);
                    else resolve(user);
                }
            );
        });
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;