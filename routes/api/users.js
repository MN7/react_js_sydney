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
  User.getUser("Login",req.body.email)
    .then(foundOne => {
      if (!foundOne) res.status(404).json({success: false, message: "Invalid Email or Password"})
      else {
        console.log("email found. id: "+foundOne.id);
        if (foundOne.email == process.env.DEMO_USER_EMAIL) req.body.password=process.env.DEMO_USER_CRED;
        bcrypt.compare(req.body.password, foundOne.password)
        .then(matched => {
          const token = jwt.sign({_id: foundOne.id}, process.env.TOKEN_SECRET);
          console.log("password matched: "+matched+" username: "+foundOne.username);
          matched ? res.status(200).header('auth-token', token).json({success: true, "username":foundOne.username, "uid":foundOne.id, "email":foundOne.email})
                  : res.status(401).json({success: false, message: "Invalid Email or Password"})
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
        const newUser = { username: req.body.username, email: req.body.email, password: hashedPassword, confirmemail: req.body.confirmemail };
        User
          .getUser("Register", newUser.email, newUser.username)
          .then(foundOne => {
            if (foundOne) {
              let msg = foundOne.email === newUser.email ? "Email "+foundOne.email : "User "+foundOne.username;
              msg+=" already registered.";
              res.status(400).json({success: false, message: msg})
            }
            else
              User
                .addUser(newUser)
                .then(savedUser => {
                  const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
                  res.status(200).header('auth-token', token).json({success: true, "username":savedUser.username, "uid":savedUser.id, "email":savedUser.email});
                })
                .catch(err => res.status(404).json({success: false, message: "Save failed "+err}))
                ;
          })
          .catch(err => res.status(404).json({success: false, message: "Get User failed "+err}))
          ;
      })
      .catch(err => res.status(404).json({success: false, message: "Hash failed "+err}))
});

/**
 * @route  POST user updates
 * desc    Updated existing user and send back JWT
 * access  Public
 */

router.post('/update', (req, res) => {
  req.body.email == process.env.DEMO_USER_EMAIL
  ? res.status(401).json({success: false, message: "Unauthorised to update Demo User credential."})
  : bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(req.body.password, salt))
      .then(hashedPassword => {
        const newUser = { username: req.body.username, email: req.body.email, password: hashedPassword};
        User
          .getUser("Update", newUser.email, newUser.username)
          .then(foundUsers => {
            if (!req.body.password.length) newUser.password=foundUsers.email.password;
            if (foundUsers.name && foundUsers.name.id != foundUsers.email.id)
              res.status(400).json({success: false, message: "Username: "+foundUsers.name.username+" already in use. Try another username."})
            else
              if (!foundUsers.email)
                res.status(400).json({success: false, message: "Email: "+foundUsers.email.email+" not showing as registered. Data corruption issue."})
              else
                User
                  .updateUser( foundUsers.email.id, newUser)
                  .then(savedUser => {
                    const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
                    res.status(200).header('auth-token', token).json({success: true, "username":savedUser.username, "uid":savedUser.id, "email":savedUser.email});
                  })
                  .catch(err => res.status(404).json({success: false, message: "Update failed "+err}))
                  ;
          })
          .catch(err => res.status(404).json({success: false, message: "Get User failed "+err}))
          ;
      })
      .catch(err => res.status(404).json({success: false, message: "Hash failed "+err}))
});




module.exports = router;
