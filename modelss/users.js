const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: String,
    password: {
        required: true,
        type: String
    },
    myIngredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MyIngredient'
    }]
});

module.exports = mongoose.model('User', userSchema);