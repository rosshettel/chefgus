'use stict';

var UserNotificationStorage = function () {
    var mongoose = require('mongoose'),
        moment = require('moment'),
        logger = require('./logger'),
        userSchema = mongoose.Schema({
            username: String,
            userid: String,
            hour: Number,
            minute: Number,
            enabled: {type: Boolean, default: true}
        }),
        User = mongoose.model('User', userSchema);

    mongoose.connect(process.env.MONGO_URL);

    this.getUsersMatchingDate = function (date, callback) {
        var hour = moment(date).hour(),
            minute = moment(date).minute();

        User.find({hour: hour, minute: minute}, function (err, users) {
            if (err) {
                logger.error('Error finding users', err);
                return callback(err);
            }

            callback(null, users);
        });
    };

    this.upsertUserRecord = function (params, callback) {
        logger.debug('upsertUserRecord', params);
        //first look up user
        User.findOne({username: params.username}, function (err, user) {
            if (err) {
                logger.error('Error finding user', err);
                return callback(err);
            }

            //if exists, update
            if (user) {
                user.hour = params.hour || user.hour;
                user.minute = params.minute || user.minute;
                user.enabled = params.enabled;
            } else {
                //else create new record
                user = new User({
                    username: params.username,
                    userid: params.userid,
                    hour: params.hour,
                    minute: params.minute,
                    enabled: params.enabled
                });
            }

            user.save(function (err) {
                if (err) {
                    logger.error('Error saving user', err);
                    return callback(err);
                }
                callback();
            });
        });
    }
};

module.exports = new UserNotificationStorage();