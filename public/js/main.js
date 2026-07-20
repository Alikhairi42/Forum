// React function (like/dislike)
async function react(targetId, targetType, reactionType) {
    try {
        const response = await fetch('/reactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                targetId: targetId,
                targetType: targetType,
                reactionType: reactionType
            })
        });

        const data = await response.json();

        if (data.success) {
            // Update counts
            if (targetType === 'post') {
                document.getElementById('like-count').textContent = data.counts.likes;
                document.getElementById('dislike-count').textContent = data.counts.dislikes;

                // Update button states
                const likeBtn = document.getElementById('like-btn');
                const dislikeBtn = document.getElementById('dislike-btn');

                if (reactionType === 'like') {
                    if (data.action === 'removed') {
                        likeBtn.classList.remove('active');
                    } else {
                        likeBtn.classList.add('active');
                        dislikeBtn.classList.remove('active');
                    }
                } else {
                    if (data.action === 'removed') {
                        dislikeBtn.classList.remove('active');
                    } else {
                        dislikeBtn.classList.add('active');
                        likeBtn.classList.remove('active');
                    }
                }
            } else {
                // Update comment counts
                document.getElementById(`comment-like-${targetId}`).textContent = data.counts.likes;
                document.getElementById(`comment-dislike-${targetId}`).textContent = data.counts.dislikes;
            }
        } else {
            alert('Please login to react');
        }
    } catch (err) {
        console.error('Reaction error:', err);
        alert('Failed to react. Please try again.');
    }
}

// Confirm delete
function confirmDelete(message) {
    return confirm(message || 'Are you sure?');
}