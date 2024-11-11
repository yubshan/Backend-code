const User = require('../models/user');


module.exports.getLogin = (req, res, next) => {
    // const isLoggedIn=req.headers.cookie.split(';')[1].trim().split('=')[1];
    const isLoggedIn = req.session.isLoggedIn || false;
        res.render('auth/login', {
                        pageTitle: 'Authetication',
                        path: '/login',
                        isAuthenticated : isLoggedIn
                    });
};
module.exports.postLogin = (req, res, next) => {
    User.findById('6731f2908d7d6a5c97f10b8a').then((user) => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err)=>{
            console.error(err);
            
            res.redirect('/');
        })
        
    }).catch((err) => {
        console.error(err);
        
    });

};
module.exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        console.error(err);
        console.log("deleted");
        res.redirect('/');
    })

};