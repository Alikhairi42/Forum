const prisma = require("../config/prisma");
const { param } = require("../routes/auth");
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

exports.deletePost = async(req, res) => {
    try {
        const postId = parseInt(req.params.id); // parmter lkin f url id 

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.userId !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. You can only delete your own posts." });
        }
        await prisma.post.delete({
            where: { id: postId }
        });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.updatePost = async(req, res) => {
    try {
        const postId = parseInt(req.params.id);

        if (isNaN(postId)) {
            return res.status(400).json({ message: "Invalid or missing Post ID" });
        }

        const { title, content } = req.body;

        // 1. Check if post exists
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // 2. Check ownership
        if (post.userId !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. You can only update your own posts." });
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                title: title || post.title,
                content: content || post.content,
            },
        });

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};