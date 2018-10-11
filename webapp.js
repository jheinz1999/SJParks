const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const config = require('./config');
const User = require('./models/User');

// Create Express web app
const app = express();

//app.set('view engine', 'html');
app.set('view engine', 'pug');

// Use morgan for HTTP request logging
app.use(morgan('combined'));

// Serve static assets
app.use(express.static('public'));

// Parse incoming form-encoded HTTP bodies
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Create and manage HTTP sessions for all requests
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * 1000,
        //activeDuration: 5 * 60 * 1000,
        httpOnly: true,
        secure: false,
        ephemeral: true,
    }
}));

// Use connect-flash to persist informational messages across redirects
app.use(flash());

// Configure application routes
require('./controllers/router')(app);

console.log('PASS: webapp.js required router')

// Handle 404
app.use(function(request, response, next) {
    response.status(404);
    response.sendFile(path.join(__dirname, 'public', '404.html'));
});

// Unhandled errors (500)
app.use(function(err, request, response, next) {
    console.error('An application error has occurred:');
    console.error(err);
    console.error(err.stack);
    response.status(500);
    response.sendFile(path.join(__dirname, 'public', '500.html'));
});

// Session
app.use('/admin', function(err, req, res, next) {
    console.log(err);
    res.redirect('/login');
});

// Export Express app
module.exports = app;
