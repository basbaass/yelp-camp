const mongoose = require('mongoose');
const Campground = require('../models/Campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log('Database Connection Established')
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    
    for(let i = 0; i < 300; i++ ){
        const rand1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            author: "60fb24c7d744a454eaec7424",
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            geometry:{
                coordinates:[`${cities[rand1000].longitude}`, `${cities[rand1000].latitude}`],
                type: 'Point',
                 },
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.Reiciendis id maxime animi omnis, quia atque illo facilis optio, mollitia minima ea eum quisquam labore ad ratione, magnam explicabo assumenda similique.',
            price: price,
            images: [
                {
                            filename: 'YelpCamp/a84wzmg48angtiwhxm6j',
                            url: 'https://res.cloudinary.com/bluetulip/image/upload/v1628967977/YelpCamp/a84wzmg48angtiwhxm6j.jpg'
                },
                {
                            filename: 'YelpCamp/jc9n5frrvjpwh8rpefcu',
                            url: 'https://res.cloudinary.com/bluetulip/image/upload/v1628967979/YelpCamp/jc9n5frrvjpwh8rpefcu.jpg'
                }
            ]
        })
        
        await c.save();
    }

    console.log("SeedComplete")

}


seedDB().then(
    () => {
        mongoose.connection.close();
        console.log('Connection Terminated.')
    }
);