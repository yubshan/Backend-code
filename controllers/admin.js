const product = require('../models/product');
const Product = require('../models/product');

module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

module.exports.postAddProduct = (req, res, next) => {
    const {title , price , description , imageUrl} = req.body;
    console.log(req.user);
    

    const product = new Product({
        title: title,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId: req.user

    } );
    
    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

module.exports.getProducts = (req, res, next) => {
    Product
        .find()
        // .populate('userId')
        .then(products => {
            res.render('admin/product-list', {
                pageTitle: 'All Products',
                path: '/admin/products',
                products: products
            });
        })
        .catch(err => console.log(err));
};

module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) return res.redirect('/');
    const productId = req.params.productId;
    
    Product
        .findById(productId)
        .then(product => {
            if(!product){
               return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: product.title,
                path: '/admin/products',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

module.exports.postEditProduct = (req, res, next) => {
    const {title , price , description , imageUrl} = req.body;
    const productId = req.body.id;
    console.log(productId);
   Product.findById(productId).then((product) => {
      console.log(product);
      
       product.title = title,
       product.price = price,
       product.description = description,
       product.imageUrl = imageUrl
       return product.save()
   }).then(result => {
            console.log("Updated product");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

module.exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .findByIdAndDelete(productId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};
