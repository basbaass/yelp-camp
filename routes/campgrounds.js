const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas.js');
const Campground = require('../models/campground');
const { isLoggedIn } = require('../middleware');

const router = express.Router();


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body); 
    if (error) {
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateOwnership = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('author');
    console.log(req.user);
    if(!campground.author._id.equals(req.user._id)){
        req.flash('error', 'You must be the owner to perform this action')
        return res.redirect(req.session.returnTo);
    }
    next()
}

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
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));


router.post('/', isLoggedIn, validateCampground,  wrapAsync(async (req,res) => {
    //res.send(req.body)
    console.log("in post")
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'You have successfully created a campground Hurray!!') 
    res.redirect(`campgrounds/${newCampground._id}`);
}))

router.put('/:id', isLoggedIn, validateOwnership, validateCampground, wrapAsync(async (req,res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', 'You have successfully edited a campground Hurray!!')
    res.redirect(`/campgrounds/${id}`)
    
}))

router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted a campground Hurray!!') 
    res.redirect('/campgrounds')
}))





module.exports = router;