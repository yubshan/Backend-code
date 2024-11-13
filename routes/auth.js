const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getResetPassword);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post(
  '/signup',
  [
    check('email').isEmail().withMessage('Please enter a valid email'),
    body(
      'password',
      'please enter a password with only text and number and at least 5 min character'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error(` Password doesn't match.`);
            
        }
        return true;
    })
  ],
  authController.postSignup
);
router.post('/reset', authController.postResetPassword);
module.exports = router;
