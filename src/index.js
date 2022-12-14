const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { engine } = require('express-handlebars');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');


const { database } = require('./keys');

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
	extname: '.hbs',
}));
app.set('view engine', 'hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
  secret: 'SICAALsession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
//app.use('/links', require('./routes/links'));
app.use('/panelA', require('./routes/panelA'));
app.use('/panelP', require('./routes/panelP'));
app.use('/Cliente', require('./routes/Clientes'));

// Public
app.use(express.static(path.join(__dirname, 'public')));
app.use("/files",express.static("storage"));
// Starting
app.listen(app.get('port'),'0.0.0.0', () => {
  console.log('Server is in port', app.get('port'));
});
