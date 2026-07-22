const prisma = require("../config/prisma");
exports.createPost = async(req, res) => {
    try {
        const { title, content } = req.body;

        const newPost = await prisma.post.create({
            data: {
                title: title,
                content: content,
                userId: req.user.userId
            }
        });
        res.status(201).json({
            message: "Post create",
            post: newPost
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error server!" });
    }
};

exports.getAllPosts = async(req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: { // acces bash njib name dyalo
                user: {
                    select: {
                        username: true
                    }
                }

            },
            orderBy: { createdAt: 'desc' } // fisrt jdad
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error f server!" });
    }
};