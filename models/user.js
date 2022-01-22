const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
        maxlength: 120
    }
},
{
    collection: "users",
    timestamps: true
});

const User = mongoose.model('Users', userSchema);

module.exports = User;