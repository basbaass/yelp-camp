const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            location: Joi.string().required(),
            //image: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number()
                .integer()
                .min(0)
                .required()

        }).required()
})

module.exports.reviewSchema = Joi.object({
        review: Joi.object({
            body: Joi.string()
                .required(),
            rating: Joi.number()
                .integer()
                .min(0)
                .max(5)
                .required()
            



        }).required()
    })


    