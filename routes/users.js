const express = require('express');
const router = express.Router();

//- Ext. Authentication module
const passport = require('passport');

//- require model 
const User = require('../models/user');

//- require controller 
const user = require('../controllers/users');


//- ROUTES

router.route('/register').
    get(user.renderRegisterForm).
    post(user.register);


router.route('/login').
    get(user.renderLoginForm).
    post(passport.authenticate('local',
        {
            failureFlash: true,
            failureRedirect: '/login'
        }),
    user.login);

router.get('/logout', user.logout);



module.exports = router;