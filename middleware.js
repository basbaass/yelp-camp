const Campground = require('./models/campground');
const Review = require('./models/review');
const { reviewSchema, campgroundSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');




module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'please sign in to complete this action');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body); 
    if (error) {
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateOwnership = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('author');
    if(!campground.author._id.equals(req.user._id)){
        req.flash('error', 'You must be the owner to perform this action')
        return res.redirect(req._parsedOriginalUrl.pathname);
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    //console.log(error)
    if (error) {
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.validateReviewOwnership = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('author');
        // .populate({
        //     path: 'reviews',
        //     populate: {
        //         path: 'author'
        //     }
        // });
    //console.log(campground);
    
    // if(!campground.author._id.equals(req.user._id)){
    //     req.flash('error', 'You must be the owner to perform this action')
    //     return res.redirect(req._parsedOriginalUrl.pathname);
    // }
    next()
}