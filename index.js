const express = require('express') ;
const app = express() ;
const bodyParser = require('body-parser') ;
const mongoose = require('mongoose') ;
const path = require('path');
const session = require("express-session") ;
const MongoStore = require('connect-mongo');
const passport = require("passport") ;
const LocalStrategy = require("passport-local") ;
const User = require("./models/user.js") ;
const flash = require("connect-flash") ;
// const Review = require("./models/review.js");
// const Listing = require("./models/listing.js");
// const ejs = require('ejs') ;
// const data = require('./init/data.js') ;
// const initDB = require('./init/init-index.js') ;
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
// const wrapAsync = require('./utils/wrapAsync'); // <-- your wrapAsync function
// const ExpressError = require('./utils/ExpressError'); // <-- your ExpressError class
// const { listingSchema } = require('./schema.js'); // <-- your Joi schema

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const http = require('http');               // NEW
const { Server } = require('socket.io');   // NEW


// create http server and attach socket.io
const server = http.createServer(app);
const io = new Server(server);

require('dotenv').config();
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas connected!"))
.catch(err => console.log("MongoDB connection error:", err));




// ===== SESSION STORE (connect-mongo) =====
const mongoUrl = process.env.DB_URL;
const sessionSecret = process.env.SESSION_SECRET || "this_should_be_changed_in_prod";

if (!mongoUrl) {
  console.error("WARNING: process.env.DB_URL is not defined. Sessions will fail without a DB URL.");
}

const store = MongoStore.create({
  mongoUrl,                     // required: Atlas connection string
  ttl: 14 * 24 * 60 * 60,       // session lifetime in seconds (14 days)
  touchAfter: 24 * 3600,        // time period in seconds to resave session only if changed
  crypto: {
    secret: sessionSecret       // used to sign/encrypt session data
  }
});

store.on("error", function (err) {
  console.error("Session store error:", err);
});

// session options
const sessionOptions = {
  store,
  name: "wanderlust.sid",                 // custom cookie name (optional)
  secret: sessionSecret,
  resave: false,                          // don't resave unchanged sessions
  saveUninitialized: false,               // don't create session until something stored
  cookie: {
    httpOnly: true,
    // secure: true,                      // enable when using HTTPS in production (Render provides HTTPS)
    maxAge: 1000 * 60 * 60 * 24 * 3      // 3 days
  }
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));


app.use((req, res , next )=> {
  res.locals.success = req.flash("success") ;
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user ;
  next() ;
})


app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs' , ejsMate) ;
app.use(express.static(path.join(__dirname, 'public'))) ;


const listingRoutes = require('./ROUTERS/listings');
const reviewRoutes = require('./ROUTERS/reviews');
const userRoutes = require('./ROUTERS/user');


// main()
// .then(() => console.log('wanderlust Connected')) 
// .catch(err => console.log(err));

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }   


// root route
app.get('/' , (req , res) => {
    console.log("Root route accessed");
    res.redirect('/listings') ;
  });

// app.get("/demo" , async (req, res) => {
//   let fakeUser = new User({username: "fakeUser" , email: "studs@gmail.com"}) ;
//   let registeredUser = await User.register(fakeUser , "chicken") ;
//   res.send(registeredUser) ;
// }) ;

// Mount Routers
app.use('/listings', listingRoutes);       // all listing routes
app.use('/listings/:id/reviews', reviewRoutes); // nested review routes
app.use('/', userRoutes); 


// //setting up the index route
// app.get('/listings', wrapAsync(async (req, res) => {
//   console.log('Seeding DB and fetching data...');
//   // await initDB();  // clears old and inserts new sample data
//   let datum = await Listing.find({})  // fetch fresh data
//   // res.send(datum );  // send as JSON
//   res.render('index.ejs' , {datum}) ;
// }));



// // route to create new listing
// app.get('/listings/new' , (req, res)=>{
//   res.render('new.ejs') ;
//   console.log("New listing form rendered");
// })



// app.post('/listings', wrapAsync(async (req, res, next) => {
//     // If your form sends JSON string for image, parse it
//     if (typeof req.body.image === "string") {
//         try {
//             req.body.image = JSON.parse(req.body.image);
//         } catch (err) {
//             return next(new ExpressError(400, "Invalid image format"));
//         }
//     }

//     // Validate with Joi
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         console.log(error);
//         return next(new ExpressError(400, error.details.map(el => el.message).join(", ")));
//     }

//     // If valid, create new listing
//     const newList = req.body;
//     await Listing.create(newList);

//     res.redirect('/listings');
// }));




// // setting up the show route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");  // <-- populate reviews
//     if (!listing) {
//         return res.status(404).send("Listing not found");
//     }
//     res.render("show.ejs", { listing });
// }));



// // setting up the post route for review on each ;isting 
// app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
    
//     if (!listing) {
//         return res.status(404).send("Listing not found");
//     }

//     const review = new Review(req.body);  // expects { rating, comment }
//     await review.save();

//     listing.reviews.push(review);  // connect review to listing
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// }));



// // Delete a review from both Review collection and the reviews array inside Listing.
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;

//     // remove review reference from the listing
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

//     // delete the actual review
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }));






// // creating an update route 
// app.get('/listings/:id/update' , wrapAsync(async(req, res )=> {
//   let listing = await Listing.findById(req.params.id) ;
//   res.render('update.ejs' , {listing }) ;
//   console.log(`update route form delivered for ${req.params.id}`) ;
// }))

// app.put('/listings/:id' , wrapAsync(async(req , res) => {
//     let updatelisting = await Listing.findByIdAndUpdate(req.params.id , req.body , {new:true, runValidators: true}) ;
//     res.redirect('/listings')
// }));

// // delete route
// app.delete('/listings/:id', wrapAsync(async (req, res) => {
//   await Listing.findByIdAndDelete(req.params.id);
//   res.redirect('/listings');
// }));


app.get('/test-db', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.send(e.message);
    }
});



// Global Error Handler
app.use((err , req,res , next)=>{
  let {status = 500 , message = "Something went wrong"} = err ;

  console.error("Server Error:", err.stack);
  res.status(status).render("error.ejs" , {status , message}) ;
})


// 404 Handler
app.use((req, res) => {
  let status = 404;
  let message = "Page Not Found";
//   console.log(res) ;
  res.status(status).render("error.ejs", { status, message });
});



// // listening to the port
// app.listen(8000, () => {
//     console.log('Listening on port 8000') ;
// }   ) ;


// listening to the port with Socket.IO
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`App + Socket.IO running on port ${PORT}`);
});
