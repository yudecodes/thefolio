// backend/routes/comment.routes.js

const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');

const router = express.Router();


// ── GET /api/comments/:postId — Get all comments ──────────────
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name profilePic')
      .sort({ createdAt: 1 }); // oldest first

    res.json(comments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── POST /api/comments/:postId — Add comment ──────────────────
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
  try {
    const { body } = req.body;

    // basic validation
    if (!body) {
      return res.status(400).json({
        message: 'Comment body is required'
      });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      body
    });

    await comment.populate('author', 'name profilePic');

    res.status(201).json(comment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── DELETE /api/comments/:id — Delete comment ─────────────────
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found'
      });
    }

    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }

    await comment.deleteOne();

    res.json({
      message: 'Comment deleted'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;