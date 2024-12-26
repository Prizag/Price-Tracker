const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item' // Reference to the Item model
    }]
});

module.exports = mongoose.model('User', userSchema);
