const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

console.log("estamo en la matrix")

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Usuario o Contraseña Incorrecto'));
    }
  } else {
    return done(null, false, req.flash('message', 'Usuario o Contraseña Incorrecto'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  const { rol } = req.body;
  let newUser = {
    fullname,
    username,
    password,
    rol
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.use('local.change', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  const { rol } = req.body;
  let newchange = {
    fullname,
    username,
    password,
    rol
  };
  newchange.password = await helpers.encryptPassword(password);
  // UPDATING in the Database
  const result = await pool.query('UPDATE users set password = ? WHERE username = ?', [newchange.password, newchange.username]);
  newchange.id = result.insertId;
  return done(null, newchange);
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});
