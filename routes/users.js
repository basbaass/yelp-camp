const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');




router.get('/register', (req, res) => {
    res.render('./users/register');
});

router.post('/register', async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const newUser = await User.register(user, password);
        console.log(newUser);
        req.login(newUser, (err) => {
            if(err) return next(err)
        })
        req.flash("success", "Welcome to Yelp Camp");
        res.redirect('/campgrounds')
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }

})

router.get('/login', (req, res) => {
    res.render('./users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    const returnUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(returnUrl);
    
    
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;