const express = require('express')
const wrapAsync = require('../utils/wrapAsync');

//- require models
const Campground = require('../models/campground');
const Review = require('../models/review');

//- require review controller
const review = require('../controllers/reviews');

//- require middleware
const { isLoggedIn, validateReview, validateReviewOwnership} = require('../middleware');


const router = express.Router({mergeParams: true});


//- ROUTES

router.route('/')
    .post(isLoggedIn, validateReview, wrapAsync(review.createReview))
    .get(wrapAsync(review.displayReviews));

    
router.delete('/:r_id', isLoggedIn, validateReviewOwnership, wrapAsync(review.destroyReview))



module.exports = router;