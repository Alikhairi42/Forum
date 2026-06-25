const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const db = require("./config/database");

const app = express();
const PORT = 3000;



//MIDDLEWARE (functions that run on every request)\

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app .use(session({
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

//ROUTES
app.get('/', (req, res) => {
    res.render('home', { title: 'Forum Home',
                    message: 'welcome to the forum' });   
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Something went wrong!');
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log('==========================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('==========================================');
});