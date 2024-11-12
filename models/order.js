const  mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user:{
        email:{
            type:String,
            required:true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    },
    products:[{
        product:{
            type:Object,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        }
    }]
});

module.exports = mongoose.model("Order", orderSchema);