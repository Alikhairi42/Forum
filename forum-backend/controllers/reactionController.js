const prisma = require('../config/prisma');

exports.toggleReact = async(req, res) => {
    try {
        const { postId, type } = req.body;
        const userId = req.user.userId;

        const numericPostId = parseInt(postId);

        if (isNaN(numericPostId)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }

        if (!type || !["LIKE", "DISLIKE"].includes(type)) {
            return res.status(400).json({ message: "Reaction type must be LIKE or DISLIKE" });
        }

        const existingReact = await prisma.react.findFirst({
            where: {
                postId: numericPostId,
                userId: userId
            }
        });

        if (existingReact) {
            if (existingReact.type === type) {
                await prisma.react.delete({ where: { id: existingReact.id } });
                return res.status(200).json({ message: "Reaction removed successfully" });
            } else {
                const updatedReact = await prisma.react.update({
                    where: { id: existingReact.id },
                    data: { type: type }
                });
                return res.status(200).json({ message: "Reaction updated successfully", react: updatedReact });
            }
        } else {
            const newReact = await prisma.react.create({
                data: {
                    type: type,
                    postId: numericPostId,
                    userId: userId
                }
            });
            return res.status(201).json({ message: "Reaction added successfully", react: newReact });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getPostReacts = async(req, res) => {
    try {
        const postId = parseInt(req.params.postId);

        if (isNaN(postId)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }

        const likesCount = await prisma.react.count({
            where: { postId: postId, type: "LIKE" }
        });

        const dislikesCount = await prisma.react.count({
            where: { postId: postId, type: "DISLIKE" }
        });

        res.status(200).json({ likes: likesCount, dislikes: dislikesCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};