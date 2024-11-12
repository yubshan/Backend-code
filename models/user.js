const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration: Date,
    cart:{

        item:[{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true,
            }
        }]
    }
});


userSchema.methods.addToCart = function(product){
     const cartProductIndex = this.cart.item.findIndex((result) =>{
        return result.productId.toString()===product._id.toString();
    });
    
    let newQuantity = 1;
    let updatedCartItems = [...this.cart.item];
    if(cartProductIndex >=0){
        newQuantity = this.cart.item[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else{
        updatedCartItems.push({
            productId:product._id,
            quantity:newQuantity
        });
    }
    const updatedCart = {
        item:updatedCartItems
    }
    this.cart = updatedCart;
    return this.save();
}


userSchema.methods.removeFromCart  = function (productId) {
    const updatedCartItems = this.cart.item.filter((item) =>{
        return item.productId.toString() != productId.toString();
    });

    this.cart.item = updatedCartItems;
    return this.save();

}

userSchema.methods.clearCart = function  () {
    this.cart= {
        item : []
    };
    return this.save();
}
module.exports = mongoose.model("User", userSchema);