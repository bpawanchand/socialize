const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../model/User');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          msg: 'Server Error'
        }
      ]
    });
  }
});

router.post(
  '/',
  [
    check('email', 'Enter a Valid email').isEmail(),
    check('password', 'Enter password').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const payload = {
        user: {
          id: user.id
        }
      };
      const token = jwt.sign(
        payload,
        config.get('jwtToken'),
        {
          expiresIn: 3600000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

module.exports = router;
