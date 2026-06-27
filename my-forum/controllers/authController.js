const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");

exports.showRegisterForm = (req, res) => {
    res.render("register", { title: "Register" ,error: null});
    };


//hanlde register
exports.handleRegister = async (req, res) => {
    const { username, email, password, confirmPassword, confirmpassword } = req.body;
    const confirmation = confirmPassword || confirmpassword;

    if(!username || !email || !password || !confirmation) {
        return res.render("register", { title: "Register" ,error: "All fields are required"});
    }
    if(password !== confirmation) {
        return res.render("register", { title: "Register" ,error: "Passwords do not match"});
    }
    if(password.length < 6) {
        return res.render("register", { title: "Register" ,error: "Password must be at least 6 characters"});
    }
    try {
        await User.create({ username, email, password });
        res.redirect('/auth/login?registered=true');
    } catch (error) {
        console.error(error);
        res.render("register", { title: "Register" ,error: "An error occurred while creating the user"});
    }
}

exports.showLogin = (req, res) => {
    const registered = req.query.registered === 'true';
    res.render('login', { 
        title: 'Login',
        error: null,
        success: registered ? 'Registration successful! Please login.' : null
    });
};

exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) {
        return res.render("login", { title: "Login" ,error: "All fields are required", success: null });
    }
    try{
     const user = await User.findByEmail(email);
        if(!user) {
            return res.render("login", { title: "Login" ,error: "Invalid email or password", success: null });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.render("login", { title: "Login" ,error: "Invalid email or password", success: null });
        }
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        db.run(
            'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
            [sessionId, user.id, expiresAt.toISOString()],
            (err) => {
                if (err) {
                    console.error('Session error:', err);
                    return res.render('login', {
                        title: 'Login',
                        error: 'Login failed. Please try again.',
                        success: null
                    });
                }

                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                };
                req.session.sessionId = sessionId;
                res.redirect('/');
            }
        );
    } catch (err) {
        console.error('Login error:', err);
        res.render('login', {
            title: 'Login',
            error: 'Login failed. Please try again.',
            success: null
        });
    }
};

exports.logout = (req, res) => {
    const sessionId = req.session.sessionId;

    if (sessionId) {
        // Delete from database
        db.run('DELETE FROM sessions WHERE id = ?', [sessionId], (err) => {
            if (err) console.error('Session deletion error:', err);
        });
    }

    // Destroy session
    req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
        res.redirect('/');
    });
};