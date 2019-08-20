const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../model/User');
const Profile = require('../model/profile');
const Posts = require('../model/Posts');
const { check, validationResult } = require('express-validator');

//  @route:   POST /post
//  @desc:    Create a new Post
//  @access:  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Enter post text')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Posts({
        user: user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      });
      const post = await newPost.save();
      res.json(await Posts.find());
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

//  @route:   DELETE /post/:post_id
//  @desc:    Delete a Post
//  @access:  Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    if (!post)
      return res.status(404).json({ errors: [{ msg: 'Post Not Found...' }] });
    if (post.user.toString() !== req.user.id)
      return res
        .status(401)
        .json({ errors: [{ msg: 'Not auhtoirzed to delete...' }] });
    await post.remove();
    res.json({ Information: [{ msg: 'Post deleted' }] });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId')
      return res.status(404).json({ errors: [{ msg: 'Post Not Found...' }] });
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   GET /post
//  @desc:    Get all user Post
//  @access:  Private
router.get('/users', auth, async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    onsole.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   GET /post
//  @desc:    Get a user's Post
//  @access:  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Posts.find({ user: req.user.id }).sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    onsole.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   GET /post/:id
//  @desc:    Get a Post by ID
//  @access:  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findOne({ id: req.params.id });
    if (!post)
      return res.status(404).json({ errors: [{ msg: 'Post Not FOund...' }] });
    res.json(post);
  } catch (error) {
    onsole.error(error.message);
    if (error.kind === 'ObjectId')
      return res.status(404).json({ errors: [{ msg: 'Post Not FOund...' }] });
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   PUT /post/like/:id
//  @desc:    Like a Post by ID
//  @access:  Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    )
      return res.status(400).json({ errors: [{ msg: 'Post Already Liked' }] });
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    onsole.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   PUT /post/unlike/:id
//  @desc:    Like a Post by ID
//  @access:  Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    )
      return res.status(400).json({ errors: [{ msg: 'Post was not Liked' }] });
    const removeIndex = post.likes
      .map(like => like.user.id.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   PUT /post/comment/:post_id
//  @desc:    Comment on a Post by ID
//  @access:  Private

router.put(
  '/comment/:post_id',
  [
    auth,
    [
      check('text', 'Enter a comment')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Posts.findById(req.params.post_id);
      if (!post)
        return res.status(400).json({ errors: [{ msg: 'Post not Found' }] });
      const postComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      };
      post.comments.unshift(postComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId')
        return res.status(400).json({ errors: [{ msg: 'Post not Found' }] });
      res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

//  @route:   DELETE /post/comment/:post_id/:com_id
//  @desc:    Delete a Comment
//  @access:  Private

router.delete('/comment/:post_id/:com_id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    //  error handling if post is not found
    if (!post)
      return res.status(400).json({ errors: [{ msg: 'Post not Found' }] });
    // find a comment from the identified post above using array find method
    const comment = post.comments.find(
      comment => comment.id === req.params.com_id
    );
    // Delete onnly the comments created by the logged in user
    // Since the above comment find statement will return an object,
    // therefore it is needed to convert the object id in to a string.
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: [{ msg: 'User not Authorized' }] });
    }
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});
module.exports = router;
