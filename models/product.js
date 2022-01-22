const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false,
        maxlength: 150,
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
},
    {
        collection: "products",
        timestamps: true
    });

const Product = mongoose.model('products', productSchema);

module.exports = Product;