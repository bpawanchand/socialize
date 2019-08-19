const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../model/User');
const config = require('config');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');

//  @route      POST users
//  @desc       To register user
//  @access     Public

router.post(
  '/register',
  [
    check('name', 'Please enter a Name')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email ID').isEmail(),
    check('password', 'Enter a password of 8 or more characters').isLength({
      min: 8
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already exists' }] });
      }
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      user = new User({
        name,
        email,
        password,
        avatar
      });

      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      await user.save();

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
      console.log(error);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

module.exports = router;
