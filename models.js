'use strict';

var mongoose = require('mongoose'),
    UserSchema = new mongoose.Schema({
        username: String,
        userid: String,
        hour: Number,
        minute: Number,
        enabled: {type: Boolean, default: true}
    });

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/chefgus');

module.exports = {
    User: mongoose.model('User', UserSchema)
};
