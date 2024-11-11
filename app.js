const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const MONGODB_URI ='mongodb+srv://yubshan09:yubshan1234567890@mern-practice.vuy41.mongodb.net/shop?retryWrites=true&w=majority&appName=MERN-Practice';


const app = express();
const store = MongoDbStore({
    uri:MONGODB_URI,
    collection:'session'
});

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
app.use(session({secret:'my secret', resave:false , saveUninitialized:false, store: store}))


app.use((req, res, next) => {
    User
        .findById('6731f2908d7d6a5c97f10b8a')
        .then(user => {
            if(user && !req.user) {
                req.user = user;
            }
            next();
        })
        .catch(err => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);

mongoose.connect(MONGODB_URI)
.then((result) => {
    User.findOne().then((user) => {
        if(!user){
            const user = new User({
                name:'yubshan',
                email:'yubshan@test.com',
                cart:{
                    item:[]
                }
            });
            user.save();
        }
        
    })
    app.listen(3000);
    console.log("Connection Sucessful");
}).catch((err) => {
    console.error(err);
    
});
