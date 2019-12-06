const mongoose = require('mongoose');

const MyIngredientSchema = new mongoose.Schema({
    name: { type: String, required: true }
});


module.exports = mongoose.model('MyIngredient', MyIngredientSchema);