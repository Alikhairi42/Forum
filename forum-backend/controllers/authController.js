const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
            message: "user registered successfully!",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error!" });
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email, email }
        });
        if (user)
            return res.status(404).json({ message: "This is email not found" });

        const passvalid = await bcrypt.compare(password, user.password);
        if (!passvalid)
            return res.status(401).json({ message: "password is not correct" });

        const token = jwt.sign({ userId: user.id },
            process.env.JWT_SECRET, { expiresIn: '1d' });


        res.status(200).json({
            message: "succed",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server faile" });
    }

};