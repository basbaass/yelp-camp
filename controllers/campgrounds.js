const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.renderIndex = async (req, res) => {
    
    const campgrounds = await Campground.find({});
    
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {
    
    res.render('campgrounds/new')
};

module.exports.renderEditForm = async (req, res) => {
    
    const { id } = req.params;
    const campground = await Campground.findById(id);
    
    res.render('campgrounds/edit', { campground });
};

module.exports.renderShowPage = async (req, res,) => {
    
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    
    if (!campground) {
        req.flash('error', 'Campground does not exist')
        return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/show', { campground });
};

module.exports.createCamp = async (req,res) => {
    const campground = new Campground(req.body.campground);

    //mapping list on images to an array of objects with only the filename and filepath
    campground.images = req.files.map(image => ({filename: image.filename, url: image.path}))
    campground.author = req.user._id;
    
    await campground.save();
    console.log(campground)
    req.flash('success', 'You have successfully created a campground Hurray!!') 
    res.redirect(`campgrounds/${campground._id}`);

}

module.exports.editCamp = async (req,res) => {
    
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, req.body.campground)
    const imgs = req.files.map(image => ({ filename: image.filename, url: image.path }))
    updatedCampground.images.push(...imgs)
    await updatedCampground.save();
    
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await updatedCampground.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages } } } })
     
    }
    req.flash('success', 'You have successfully edited a campground Hurray!!')
    res.redirect(`/campgrounds/${id}`)
    
}

module.exports.destoryCamp = async (req, res) => {
    const {id} = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted a campground Hurray!!') 
    res.redirect('/campgrounds')
}