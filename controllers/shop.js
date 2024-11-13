const Product = require('../models/product');
const Order = require('../models/order');
const ITEM_PER_PAGE = 1;

module.exports.getIndex = (req, res, next) => {

    const page = +req.query.page;
    let totalItem ;
    Product.find().countDocuments().then((numproduct) => {
         totalItem= numproduct;
        return Product
        .find()
        .skip((page-1)* ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/',
                products: products,
                currentPage: page,
                hasNextPage: ITEM_PER_PAGE * page < totalItem,
                hasPreviousPage: page > 1,
                nextPage : page + 1,
                previousPage : page -1,
                lastPage: Math.ceil(totalItem / ITEM_PER_PAGE)

                
            });
        })
        .catch(err => console.log(err));
};

module.exports.getProducts = (req, res, next) => {
    const page = +req.query.page;
    let totalItem ;
    Product.find().countDocuments().then((numproduct) => {
         totalItem= numproduct;
        return Product
        .find()
        .skip((page-1)* ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Products',
                path: '/products',
                products: products,
                currentPage: page,
                hasNextPage: ITEM_PER_PAGE * page < totalItem,
                hasPreviousPage: page > 1,
                nextPage : page + 1,
                previousPage : page -1,
                lastPage: Math.ceil(totalItem / ITEM_PER_PAGE)

                
            });
        })
        .catch(err => console.log(err));

};

module.exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product
        .findOne({_id: productId})
        .then(product => {
            res.render('shop/product-details', {
                pageTitle: product.title,
                path: '/products',
                product: product,
                isAuthenticated : req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

module.exports.getCart = (req, res, next) => {
    req.user.populate('cart.item.productId')
        .then(user => {
            const products = user.cart.item;
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};


module.exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            req.user.addToCart(product)
        }).then((result)=>{
            console.log("Sucessfully added");
             res.redirect('/cart');

        }).catch(err => console.log(err));
};

module.exports.postDeleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

module.exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
    .then((orders) => {
        res.render('shop/orders', {
                        pageTitle: 'Orders',
                        path: '/orders',
                        orders: orders,
                        isAuthenticated : req.session.isLoggedIn
                    });
    }).catch((err) => {
        console.error(err);
        
    });

};
module.exports.postOrder = (req, res, next) => {
    req.user.populate('cart.item.productId')
        .then(user => {
            const products = user.cart.item.map(item => {
                return { quantity: item.quantity, product: { ...item.productId._doc } };
            });

            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });

            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};
