const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const MONGODB_URI ='mongodb+srv://yubshan09:yubshan1234567890@mern-practice.vuy41.mongodb.net/shop?retryWrites=true&w=majority&appName=MERN-Practice';
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();
const store = MongoDbStore({
    uri:MONGODB_URI,
    collection:'session'
});
const csrfProtection = csrf();

const errorsController = require('./controllers/errors.js');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Models
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User
        .findById(req.session.user._id) // Using user ID from session
        .then(user => {
            if (user) {
                req.user = user;
            }
            next();
        })
        .catch(err => console.log(err));
});
app.use( (req, res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
   next(); 
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);

mongoose.connect(MONGODB_URI)
.then((result) => {
    app.listen(3000);
    console.log("Connection Sucessful");
}).catch((err) => {
    console.error(err);
    
});
