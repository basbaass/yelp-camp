const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {

    //Find Campground & create review obj
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;

    //add review to campground
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'You have successfully created a review Hurray!!') 
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.displayReviews = async (req, res) => {

    const { id } = req.params;

    res.redirect(`/campgrounds/${id}`);
}

module.exports.destroyReview = async (req, res) => {

    //Destructure campground ID and review ID
    const { id, r_id } = req.params;
    // Update remove review from Campground - then delete orphan review.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: r_id } })
    const deletedReview = await Review.findByIdAndDelete(r_id);
    
    req.flash('success', 'You have successfully deleted a review Hurray!!') 
    res.redirect(`/campgrounds/${id}`)
}