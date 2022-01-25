const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false,
        maxlength: 50,
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        maxlength: 150,
    },
    url: {
        type: String,
        unique: false
    },
    imagename: {
        type: String,
        unique: false,
        maxlength: 100,
    },
    location: {
        type: String,
        unique: false
    },
},
    {
        collection: "products",
        timestamps: true
    });

const Product = mongoose.model('products', productSchema);

module.exports = Product;