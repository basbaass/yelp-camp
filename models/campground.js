const { string } = require('joi');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
    
    title: String,
    price: Number,
    images: [
        {
            filename: String,
            url: String
        }
    ],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }]

})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
}) 


module.exports = mongoose.model('Campground', CampgroundSchema);
