'use stict';

var UserNotificationStorage = function () {
    var sqlite3 = require('sqlite3').verbose(),
        db = new sqlite3.Database('./userNotifications.db'),
        moment = require('moment'),
        logger = require('./logger');

    this.getUsersMatchingDate = function (date, callback) {
        var hour = moment(date).hour(),
            minute = moment(date).minute();


    };
};

module.exports = new UserNotificationStorage();