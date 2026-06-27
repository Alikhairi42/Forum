const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const db = require("./config/database");

const app = express();
const PORT = 3001;



//MIDDLEWARE (functions that run on every request)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: false } // Set to true if using HTTPS
}));

app.use((req, res,next) =>{
    res.locals.user =  req.session.user || null;
    next();
})

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

// ==========================================
// ROUTES
// ==========================================

// Home page (with posts)
const postController = require('./controllers/postController');
app.get('/', postController.index);

// Auth routes
app.use('/auth', require('./routes/auth'));

// Post routes
app.use('/posts', require('./routes/posts'));

// Comment routes
app.use('/comments', require('./routes/comments'));

// Reaction routes
app.use('/reactions', require('./routes/reactions'));

// 404 handler
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Something went wrong!');
});



app.listen(PORT, () => {
    console.log('==========================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('==========================================');
});