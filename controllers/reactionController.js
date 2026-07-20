const Reaction = require('../models/Reaction');

// Toggle reaction
exports.toggle = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { targetId, targetType, reactionType } = req.body;

    // Validation
    if (!targetId || !targetType || !reactionType) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (!['post', 'comment'].includes(targetType)) {
        return res.status(400).json({ error: 'Invalid target type' });
    }

    if (!['like', 'dislike'].includes(reactionType)) {
        return res.status(400).json({ error: 'Invalid reaction type' });
    }

    try {
        const result = await Reaction.toggle(
            req.session.user.id,
            targetId,
            targetType,
            reactionType
        );

        // Get new counts
        const counts = await Reaction.getCounts(targetId, targetType);

        res.json({
            success: true,
            action: result.action,
            counts: counts
        });
    } catch (err) {
        console.error('Reaction error:', err);
        res.status(500).json({ error: 'Failed to react' });
    }
};