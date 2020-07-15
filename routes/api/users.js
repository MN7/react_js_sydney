const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require ('../../models/User.js');

/**
 * @route  GET ALL users
 * desc    Get list of all users in db
 * access  RESTRICTED - admin-only
 */

router.get('/', (req, res) => {
  User.getUsers()
    .then(users => res.json(users));
});

/**
 * @route   DELETE user
 * desc    Delete user
 * access  RESTRICTED - admin-only
 */

router
  .delete('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => user.deleteOne()
      .then(() => res.json({success: true, message:"User "+user.username+" deleted from db."}))
  )
  .catch(err => res.status(404).json({success: false, message: err}))
  ;
});

/**
 * @route  GET user token
 * desc    Authenticate user, pwd and send JWT
 * access  Public
 */

router.post('/login', (req, res) => {
  console.log("reached login at server side"+JSON.stringify(req.body));
  User.getUser(req.body.email)
    .then(foundOne => {
      if (!foundOne) res.status(400).json({success: false, message: "Email: "+req.body.email+" not registered."})
      else {
        console.log("email found. id: "+foundOne.id);
        if (req.body.email == "demouser@sampleapp.com") req.body.password=process.env.DEMO_USER_CRED;
        bcrypt.compare(req.body.password, foundOne.password)
        .then(matched => {
          const token = jwt.sign({_id: foundOne.id}, process.env.TOKEN_SECRET);
          console.log("password matched. username: "+foundOne.username);
          matched ? res.status(200).header('auth-token', token).json({success: true, "username":foundOne.username, "uid":foundOne.id, "email":foundOne.email})
                  : res.status(400).json({success: false, message: "Invalid Email or Password"})
        })
        .catch(err => res.status(400).json({success: false, message: "Hash failed "+err}))
      }
    })
    .catch(err => res.status(400).json({success: false, message: "Get User failed "+err}))
    ;
});

/**
 * @route  POST new user
 * desc    Register new user and send back JWT
 * access  Public
 */

router.post('/register', (req, res) => {
    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(req.body.password, salt))
      .then(hashedPassword => {
        const newUser = { username: req.body.username, email: req.body.email, password: hashedPassword};
        User
          .getUser(newUser.email)
          .then(foundOne => {
            if (foundOne) res.status(400).json({success: false, message: "Email: "+newUser.email+" already registered."})
            else
              User
                .addUser(newUser)
                .then(savedUser => {
                  const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
                  res.header('auth-token', token).json({success: true});
                })
                .catch(err => res.status(404).json({success: false, message: "Save failed "+err}))
                ;
          })
          .catch(err => res.status(404).json({success: false, message: "Get User failed "+err}))
          ;
      })
      .catch(err => res.status(404).json({success: false, message: "Hash failed "+err}))

  // const newUser = new User({
  //   username: req.body.username, email: req.body.email, password: hashedPassword
  // });
  //
  // User
  //   .findOne({email: newUser.email})
  //   .then(foundOne => {
  //     if (foundOne) res.status(400).json({success: false, message: "Email: "+newUser.email+" already registered."})
  //     else
  //       newUser
  //         .save()
  //         .then(savedUser => res.json(savedUser))
  //         .catch(err => res.status(404).json({success: false, message: err}))
  //         ;
  //   })
  //   .catch(err => res.status(404).json({success: false, message: err}))
  //   ;

});


module.exports = router;
