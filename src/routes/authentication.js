const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const passport = require('passport');
const { isLoggedIn, isNotLoggedin , isAdmin , isProveedor } = require('../lib/auth');

// SIGNUP
router.get('/signup', isAdmin, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  
  passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});


router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
      }
    res.redirect('/');
  });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;
