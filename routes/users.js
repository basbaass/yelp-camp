const express = require('express');
const router = express.Router();

//- Ext. Authentication module
const passport = require('passport');

//- require model 
const User = require('../models/user');

//- require controller 
const user = require('../controllers/users');


//- ROUTES


router.get('/register', user.renderRegisterForm);

router.post('/register', user.register)

router.get('/login', user.renderLoginForm);

router.post('/login',
    passport.authenticate('local',
        {
            failureFlash: true,
            failureRedirect: '/login'
        }),
    user.login);

router.get('/logout', user.logout);



module.exports = router;