const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {validationResult} = require('express-validator')

module.exports.getLogin = (req, res, next) => {
    let message = req.flash('loginError');
    if(message.length>0){
        message= message[0];
    }else{
        message= null;
    }

        res.render('auth/login', {
                        pageTitle: 'Authetication',
                        path: '/login',
                        errorMessage: message
                    });
};

module.exports.getSignup = (req, res, next) => {
        let message = req.flash('signupError');
        if(message.length >0){
            message = message[0];
        }else{
            message= null;
        }
        res.render('auth/signup', {
                        pageTitle: 'Sign-Up',
                        path: '/signup',
                        errorMessage : message,
                        oldInput:{
                            email:'',
                            password:'',
                            confirmPassword:''
                        },
                        validationErrors:[]
                    });
};
module.exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('loginError', 'Invalid Email or Password')
                return res.redirect('/login'); // Return to avoid further execution
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;   // Store user in session
                        req.session.isLoggedIn = true;
                        req.user = user;  // Make user accessible via req.user
                        return req.session.save(err => {
                            if (err) {
                                console.error(err);
                                return res.redirect('/login'); // Redirect to login if there's an error
                            }
                            res.redirect('/'); // Redirect to the home page after successful login
                        });
                    }
                    req.flash('loginError', 'Invalid Email or Password')
                    res.redirect('/login'); // Redirect if passwords don't match
                })
                .catch(err => {
                    console.error(err);
                    req.flash('loginError', 'Invalid Email or Password')
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/login');
        });
};




module.exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        console.error(err);
        console.log("deleted");
        res.redirect('/');
    })
};
module.exports.postSignup = (req, res, next) => {
   const {email , password, confirmPassword } = req.body;
   const error = validationResult(req);
   if(!error.isEmpty()){
    return res.status(422).render('auth/signup', {
        pageTitle: 'Sign-Up',
        path: '/signup',
        errorMessage : error.array()[0].msg,
        oldInput:{
            email,
            password,
            confirmPassword
        },
        validationErrors: error.array()
    });
   }
   User.findOne({email:email}).then((userDoc) => {
    if(userDoc){
        req.flash('signupError', 'Given Email Already Exist.')
        return res.redirect('/signup');
    }
   
   return bcrypt.hash(password, 12).then((hashedPassword) => {
    const user =new User({
        email:email,
        password:hashedPassword,
        cart:{
            item:[]
        }
    });
    return user.save();
   })
   .then((result) => {
    req.flash('signupEmailError', 'Something Went Wrong')
    res.redirect('/login');
   });
    
   })
   .catch((err) => {
    console.error(err);
    
   });

};

module.exports.getResetPassword = (req, res, next)=>{
    let message = req.flash('signupError');
    if(message.length >0){
        message = message[0];
    }else{
        message= null;
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage : message,
    });
}
module.exports.postResetPassword = (req, res, next)=>{
    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.error(err)
            return res.redirect("/reset");
            
        }
        const token = buffer.toString('hex');
        User.findOne({email:req.body.email}).then((user) => {
            if(!user){
                req.flash('resetError' , 'No account with that email found.');
                res.redirect('/reset');
                
            }
            
            user.resetToken = token;
            user.resetTokenExpiration= Date.now() + 3600000;
            return user.save();
        }).then((result) => {
            res.redirect(`/reset/{token}`)
        })
        .catch((err) => {

            console.error(err);
            
        });
    })
}
