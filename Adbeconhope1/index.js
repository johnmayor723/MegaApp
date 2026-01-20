const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const app = express();
const PORT = 3061;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');


// DB connection
const DB = 'mongodb+srv://admin:majoje1582@cluster0.cqudxbr.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(DB)
  .then(() => console.log("Adebeconhope DB connected"))
  .catch(err => console.log("Mongoose connection error:", err));              
 // process.env.DBURL ||





// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'))


// ===== Sessions =====
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: DB }),
  })
);




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(methodOverride('_method'));




// Routers
const indexRouter = require("./routes/index");
const managementRouter = require('./routes/management');

app.use("/", indexRouter);

app.use('/management', managementRouter);

// Server
module.exports = app
// app.listen(PORT, () => { --- IGNORE ---
//     console.log(`🚀 Server running on port ${PORT}`); --- IGNORE ---
// }); --- IGNORE ---   