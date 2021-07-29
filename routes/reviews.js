const express = require('express')
const wrapAsync = require('../utils/wrapAsync');

const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas.js');
const { isLoggedIn, validateOwnership, validateReview, validateReviewOwnership} = require('../middleware');

const router = express.Router({mergeParams: true});




router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'You have successfully created a review Hurray!!') 
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/', wrapAsync(async (req, res) => {
    console.log()
    const { id } = req.params;
    res.redirect(`/campgrounds/${id}`);
}))




router.delete('/:r_id', isLoggedIn, validateReviewOwnership, wrapAsync(async (req, res) => {
    const { id, r_id } = req.params;
    console.log("1")
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: r_id } })
    console.log("2")
    const deletedReview = await Review.findByIdAndDelete(r_id);
    req.flash('success', 'You have successfully deleted a review Hurray!!') 
    res.redirect(`/campgrounds/${id}`)
}))



module.exports = router;