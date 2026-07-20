const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
exports.register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const userFind = await prisma.user.findUnique({
            where: { email: email }
        });

        if (userFind) {
            return res.status(400).json({ message: "This email is already in use!" })
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: password,
            }
        });
        res.status(201).json({
            message: "User registered successfully! 🎉",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error!" });
    }
};