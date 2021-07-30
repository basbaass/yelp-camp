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

router.get('/', wrapAsync(campground.renderIndex))

router.get('/new', isLoggedIn, campground.renderNewForm);

router.get('/:id/edit', isLoggedIn, wrapAsync(campground.renderEditForm))

router.get('/:id', wrapAsync(campground.renderShowPage));

router.post('/', isLoggedIn, validateCampground,  wrapAsync(campground.createCamp))

router.put('/:id', isLoggedIn, validateOwnership, validateCampground, wrapAsync(campground.editCamp))

router.delete('/:id', isLoggedIn, validateOwnership, wrapAsync(campground.destoryCamp))





module.exports = router;