const prisma = require('../config/prisma');

exports.createComment = async(req, res) => {
    try {
        const { content, postId } = req.body;

        const numericPostId = parseInt(postId);

        if (isNaN(numericPostId)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }

        const post = await prisma.post.findUnique({
            where: { id: numericPostId }
        });

        if (!post) {
            return res.status(404).json({ message: "Cannot add comment: Post not found" });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: numericPostId,
                userId: req.user.userId
            }
        });

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getPostComments = async(req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        if (isNaN(postId)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }
        const findp = await prisma.post.findUnique({
            where: { id: postId }
        });
        if (!findp) {
            return res.status(404).json({ message: "Cannot add comment: Post not found" });
        }
        const comments = await prisma.comment.findMany({
            where: { postId: postId },
            include: {
                user: { select: { username: true } }
            },
            orderBy: { createdAt: 'asc' } //lqdime howa lwl
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateComment = async(req, res) => {
    try {
        const commentId = parseInt(req.params.commentId);
        const { content } = req.body;

        if (isNaN(commentId)) {
            return res.status(400).json({ message: "Invalid Comment ID" });
        }

        if (!content) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. You can only update your own comments." });
        }
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content }
        });
        res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteComment = async(req, res) => {
    try {
        const commentId = parseInt(req.params.commentId);

        if (isNaN(commentId)) {
            return res.status(400).json({ message: "Invalid Comment ID" });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. You can only delete your own comments." });
        }

        const deletedComment = await prisma.comment.delete({
            where: { id: commentId },
        });

        res.status(200).json({
            message: "Comment deleted successfully",
            comment: deletedComment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};