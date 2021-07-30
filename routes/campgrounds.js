const express = require('express');
const wrapAsync = require('../utils/wrapAsync');

//- require model
const Campground = require('../models/campground');
//- require Review Controller
const campground = require('../controllers/campgrounds');
//- require middleware
const { isLoggedIn, validateOwnership, validateCampground } = require('../middleware');

const router = express.Router();

//- ROUTES

router.route('/')
    .get(wrapAsync(campground.renderIndex))
    .post(isLoggedIn, validateCampground,  wrapAsync(campground.createCamp))


router.route('/:id')
    .get(wrapAsync(campground.renderShowPage))
    .put(isLoggedIn, validateOwnership, validateCampground, wrapAsync(campground.editCamp))
    .delete(isLoggedIn, validateOwnership, wrapAsync(campground.destoryCamp));


router.get('/new', isLoggedIn, campground.renderNewForm);

router.get('/:id/edit', isLoggedIn, wrapAsync(campground.renderEditForm))


module.exports = router;