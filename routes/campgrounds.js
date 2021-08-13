const express = require('express');
const wrapAsync = require('../utils/wrapAsync');

//- require model
const Campground = require('../models/campground');
//- require Review Controller
const campground = require('../controllers/campgrounds');
//- require middleware
const { isLoggedIn, validateOwnership, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({storage})

const router = express.Router();


//- ROUTES


console.log("in campground route")

router.get('/new', isLoggedIn, campground.renderNewForm);

router.route('/')
    .get(wrapAsync(campground.renderIndex))
    //.post(isLoggedIn, validateCampground,  wrapAsync(campground.createCamp))
    .post(upload.array('image'), (req, res) => {
        console.log(req.files)
        res.send("done")
    })


router.route('/:id')
    .get(wrapAsync(campground.renderShowPage))
    .put(isLoggedIn, validateOwnership, validateCampground, wrapAsync(campground.editCamp))
    .delete(isLoggedIn, validateOwnership, wrapAsync(campground.destoryCamp));



router.get('/:id/edit', isLoggedIn, wrapAsync(campground.renderEditForm))


module.exports = router;