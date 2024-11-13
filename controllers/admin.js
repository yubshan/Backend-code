const product = require('../models/product');
const Product = require('../models/product');

module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated : req.session.isLoggedIn
    });
};

module.exports.postAddProduct = (req, res, next) => {
    const {title , price , description } = req.body;
    const image = req.file;
    if(!image){
        res.redirect('/admin/products');
    }

    const imageUrl = image.path.replace(/\\/g, '/'); // Ensures forward slashes

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
        .find({userId: req.user._id})
        // .populate('userId')
        .then(products => {
            res.render('admin/product-list', {
                pageTitle: 'All Products',
                path: '/admin/products',
                products: products,
                isAuthenticated : req.session.isLoggedIn
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
                product: product,
                isAuthenticated : req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

module.exports.postEditProduct = (req, res, next) => {
    const {title , price , description } = req.body;
    const image = req.file;
    const productId = req.body.id;
   Product.findById(productId).then((product) => {
      
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
       product.title = title;
       product.price = price;
       product.description = description;
       if(image){

           product.imageUrl = image.path.replace(/\\/g, '/');
       }
       return product.save().then(result => {
        console.log("Updated product");
        res.redirect('/admin/products');
    })
   })
        .catch(err => console.log(err));
};

module.exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product
        .deleteOne({_id:productId , userId : req.user._id})
        .then(result => {
            res.json({message:'success!'});
        })
        .catch(err => console.log(err));
};
