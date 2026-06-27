const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.created_at = data.created_at;
    }

    comparePassword(inputPassword) {
        return bcrypt.compareSync(inputPassword, this.password);
    }

    static async create(dataOrUsername, email, password) {
        const userData = typeof dataOrUsername === "object"
            ? dataOrUsername
            : { username: dataOrUsername, email, password };

        return new Promise((resolve, reject) => {
            try {
                const hashedPassword = bcrypt.hashSync(userData.password, 10);
                db.run(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [userData.username, userData.email, hashedPassword],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ id: this.lastID, username: userData.username, email: userData.email });
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user ? new User(user) : null);
                }
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user ? new User(user) : null);
                }
            });
        });
    }
}

module.exports = User;