const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const helpers = require('../lib/helpers');

const pool = require('../database');
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

// Donde puede el Administrador: recuperar contrseñas para los proveedores 
router.get('/restaurar', isAdmin, async(req, res) => {
  const cuentas = await pool.query('SELECT username FROM users');
  console.log(cuentas[2].username);
  res.render('admins/restaurar', { cuentas : cuentas });
});

router.post('/restaurar', passport.authenticate('local.change', {
  successRedirect: '/',
  failureRedirect: '/restaurar',
  failureFlash: true
}));


/*
router.post('/restaurar', isAdmin ,  async (req, res) => {
  console.log("hola intentaremos cambiar la contraseña:");
  const id = req.user.id;
  const { username, contraseña } = req.body;
  console.log(contraseña);
  PASS = await helpers.encryptPassword(contraseña[1]);
  console.log("nueva contraseña: "+ PASS);
  await pool.query('UPDATE users set password = ? WHERE username = ?', [PASS, username]);
  req.flash('Logrado', 'Contrseña Actualizada Correctamente');
  res.redirect('/panelA/perfilA');
});

*/

// SIGNUP
router.get('/signup', isAdmin, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/panelA/CrearDatos',
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
