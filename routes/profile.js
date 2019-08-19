const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../model/profile');
const User = require('../model/User');
const { check, validationResult } = require('express-validator');
const dateformat = require('dateformat');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User do have any profile information' }] });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   POST /profile
//  @desc:    Create or update user profile
//  @access:  Private
router.post(
  '/createupdate',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Please enter skills')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        linkedin,
        facebook,
        instagram
      } = req.body;

      //  Buid Profile Object
      const profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (bio) profileFields.bio = bio;
      if (githubusername) profileFields.githubusername = githubusername;
      if (status) profileFields.status = status;
      if (location) profileFields.location = location;
      if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
      }

      //  Build Profile Social
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (twitter) profileFields.social.twitter = twitter;
      if (instagram) profileFields.social.instagram = instagram;
      if (facebook) profileFields.social.facebook = facebook;

      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //  Update Profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //  Create a new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

//  @route:   GET /all
//  @desc:    GET all Profiles
//  @access:  Public
router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   GET /user/:user_id
//  @desc:    GET user Profiles
//  @access:  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Profile not Found...' }] });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Profile not Found...' }] });
    }
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   DELETE /profile
//  @desc:    Delete User Profile
//  @access:  Private
router.delete('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'Profile not found' }] });
    }
    await profile.delete();
    await User.findOneAndDelete({ _id: req.user.id });
    return res.json({
      information: [{ msg: 'Profile Deleted...' }, { msg: 'User Deleted...' }]
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

//  @route:   PUT /exp
//  @desc:    Add profile experience
//  @access:  Private
router.put(
  '/exp',
  [
    auth,
    [
      check('title', 'Enter Title')
        .not()
        .isEmpty(),
      check('company', 'Enter Company')
        .not()
        .isEmpty(),
      check('from', 'Enter From date')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //  Check for middleware error
    for (let index = 0; index < req.body.length; index++) {
      const errors = validationResult(req.body[index]);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      try {
        //  Build the JSON  Object for Experience-Desctructring
        const newExp = {};
        if (req.body[index].title) newExp.title = req.body[index].title;
        if (req.body[index].company) newExp.company = req.body[index].company;
        if (req.body[index].location)
          newExp.location = req.body[index].location;
        if (req.body[index].current) newExp.current = req.body[index].current;
        if (req.body[index].desc) newExp.desc = req.body[index].desc;
        if (req.body[index].from) newExp.from = req.body[index].from;
        if (req.body[index].to) newExp.to = req.body[index].to;
        // console.log(req.body[index].from);
        // console.log(new dateformat(req.body[index].from));
        //  Find the exact profile by User ID
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Profile Not Found...' }] });
        }
        console.log(newExp);
        profile.experience.unshift(newExp);
        //  Update experince profile
        await profile.save();
        res.json(profile);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
      }
    }
  }
);

module.exports = router;
