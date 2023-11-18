const express = require('express');
const User = require('../models/User');
const router = express.Router();
// from express validation
const { body, validationResult } = require('express-validator');
// bcrypt adds salt in password
const bcrypt = require('bcryptjs');
// jwt gives the token in return for login
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Priyanshuisgo$d';



// ROUTE 1: Create a User using POST "/api/auth/".

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  let success = false;

  // from express validator

  // If errors return bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  // putting the thing in try catch and checking for duplicacy
  try {
    // checking for duplicacy
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success,error: "User exists" })
    }

    // await: it would be used if the function is asyncronus
    // becrypt
    // generating the salt
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // creating a user
    user = await User.create({
      name: req.body.name,
      // password: req.body.password,
      password: secPass,
      email: req.body.email,
    })

    // res.json(user)
    // by decoding the token we get the id and from that all the data could be extracted
    const data = {
      user: {
        id: user.id
      }
    }

    // refer to ss for more info
    const authtoken = jwt.sign(data, JWT_SECRET);

    success = true;
    res.json({ success, authtoken })
  }

  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: User Authentication

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // extracting the email and password
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ error: "invalid mail" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({success, error: "wrong pass" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authtoken })

  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// ROUTE 3: User details extracted

// the extraction code is in middleware fetchuser
router.post('/getuser', fetchuser, async (req, res) => {
// send JWT to this route and get details

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router