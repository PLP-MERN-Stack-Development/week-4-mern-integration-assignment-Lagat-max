const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/posts/:id - Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email')
      .populate('category', 'name');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts - Create a new post (protected)
router.post(
  '/',
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, content, category } = req.body;
    try {
      // Check if category exists
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ msg: 'Invalid category' });
      const post = new Post({
        title,
        content,
        category,
        author: req.user.id,
      });
      await post.save();
      const populatedPost = await post.populate('author', 'username email').populate('category', 'name');
      res.status(201).json(populatedPost);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// PUT /api/posts/:id - Update a post (protected, only author)
router.put(
  '/:id',
  auth,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
      // Update fields if provided
      if (req.body.title) post.title = req.body.title;
      if (req.body.content) post.content = req.body.content;
      if (req.body.category) {
        const cat = await Category.findById(req.body.category);
        if (!cat) return res.status(400).json({ msg: 'Invalid category' });
        post.category = req.body.category;
      }
      await post.save();
      const populatedPost = await post.populate('author', 'username email').populate('category', 'name');
      res.json(populatedPost);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// DELETE /api/posts/:id - Delete a post (protected, only author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 