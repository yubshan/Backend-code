const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();


const errorsController = require('./controllers/errors.js');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Models
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


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

app.use(errorsController.get404);

mongoose.connect('mongodb+srv://yubshan09:yubshan1234567890@mern-practice.vuy41.mongodb.net/shop?retryWrites=true&w=majority&appName=MERN-Practice')
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
