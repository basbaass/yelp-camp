const User = require('../models/user');

module.exports.register = async(req, res, next) => {
    
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const newUser = await User.register(user, password);
        console.log(newUser)
        req.login(newUser, (err) => {
            if(err) return next(err)
        })
        req.flash("success", "Welcome to Yelp Camp");
        res.redirect('/campgrounds')
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }

}

module.exports.renderRegisterForm = (req, res) => {
    res.render('./users/register');
};

module.exports.renderLoginForm = (req, res) => {
    
    res.render('./users/login');
};

module.exports.login = (req, res) => {
    
    req.flash('success', 'Welcome back!')
    
    const returnUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    
    res.redirect(returnUrl);
};

module.exports.logout = (req, res) => {
    
    req.logout();
    res.redirect('/campgrounds');
};