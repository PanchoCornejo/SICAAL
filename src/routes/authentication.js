const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const passport = require('passport');
const { isLoggedIn, isNotLoggedin , isAdmin , isProveedor } = require('../lib/auth');

// RegistroClientes
router.get('/registroclientes', (req, res) => {
  res.render('auth/registroclientes');
});

router.post('/registroclientes', passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/registroclientes',
  failureFlash: true
}));


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
  if (req.user.rol == 'Admin'){
    res.redirect('panelA/perfilA');
  }
  else if (req.user.rol == 'Proveedor'){
    res.redirect('panelP/perfilP');
  }
  res.redirect('Cliente/Panel');
});

module.exports = router;
