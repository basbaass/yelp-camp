const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas.js');
const Campground = require('../models/campground');
const { isLoggedIn, validateOwnership, validateCampground } = require('../middleware');

const router = express.Router();

router.get('/', wrapAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}))

router.get('/:id', wrapAsync(async (req, res,) => {
    const campground = await (await Campground.findById(req.params.id).populate('reviews').populate('author'));
    //console.log(campground)
    if (!campground) {
        req.flash('error', 'Campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}));


router.post('/', isLoggedIn, validateCampground,  wrapAsync(async (req,res) => {
    //res.send(req.body)
    //console.log("in post")
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'You have successfully created a campground Hurray!!') 
    res.redirect(`campgrounds/${campground._id}`);
}))

router.put('/:id', isLoggedIn, validateOwnership, validateCampground, wrapAsync(async (req,res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', 'You have successfully edited a campground Hurray!!')
    res.redirect(`/campgrounds/${id}`)
    
}))

router.delete('/:id', isLoggedIn, validateOwnership, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted a campground Hurray!!') 
    res.redirect('/campgrounds')
}))





module.exports = router;