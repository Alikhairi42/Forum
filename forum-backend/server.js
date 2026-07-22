const express = require('express');
const cors = require('cors'); //Cross-Origin Resource Sharing
require('dotenv').config();


const app = express();

//midlwa
app.use(cors()); // react -front 
app.use(express.json());

// router
const authR = require('./routes/auth');
app.use('/api/auth', authR)

//por
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});