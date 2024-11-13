const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is_auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// // /admin/edit-product => GET
router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

// // /admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddProduct);

// // /admin/edit-product => POST
router.post('/edit-product',isAuth, adminController.postEditProduct);

// // /admin/delete-product => POST
router.delete('/product/:productId',isAuth, adminController.deleteProduct);

module.exports = router;
