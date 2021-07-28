const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const ExpressError = require('./utils/ExpressError');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const session = require('express-session')
const flash = require('connect-flash');

const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const engine = require('ejs-mate');
const methodOverride = require('method-override');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log('Database Connected!')
});


const app = express();

const sessionConfig = {

    secret: 'hambalyo',
    resave: false,
    saveUninitialized: true
    // cookie: {
    //     httpOnly: true,
    //     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    // }


}


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname, 'public')))
app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 




app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    console.log("in app,js")
    next(new ExpressError('Page Not Found',404))
    
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) { err.message = "Something Went Wrong" }
    res.status(statusCode)
    res.render('error', { err })
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})

