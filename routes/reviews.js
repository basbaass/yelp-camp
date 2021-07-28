const express = require('express')
const wrapAsync = require('../utils/wrapAsync');

const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas.js');

const router = express.Router({mergeParams: true});


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    console.log(error)
    if (error) {
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'You have successfully created a review Hurray!!') 
    res.redirect(`/campgrounds/${campground._id}`);
}))




router.delete('/:r_id', wrapAsync(async (req, res) => {
    const { id, r_id } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: r_id}})
    const deletedReview = await Review.findByIdAndDelete(r_id);
    req.flash('success', 'You have successfully deleted a review Hurray!!') 
    res.redirect(`/campgrounds/${id}`)
}))



module.exports = router;