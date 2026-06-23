const sqlite3 = require('sqlite3').verbose();
const path = require('path');//begi

const dbPath = path.join(__dirname, '../database/forum.db');
const db = new sqlite3.Database(dbPath, (err) =>{
    if(err){
        console.error('❌ Database error:', err);
    }else {
        console.log('✅ Connected to database');
    }
});

db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating users table:', err);
        else console.log('✅ Users table ready');
    });

    // Posts table
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) console.error('Error creating posts table:', err);
        else console.log('✅ Posts table ready');
    });

    // Comments table
    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) console.error('Error creating comments table:', err);
        else console.log('✅ Comments table ready');
    });

    // Sessions table
    db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) console.error('Error creating sessions table:', err);
        else console.log('✅ Sessions table ready');
    });
});

// Export database
module.exports = db;