'use stict';

var UserNotificationStorage = function () {
    var sqlite3 = require('sqlite3').verbose(),
        db = new sqlite3.Database('./userNotifications.db'),
        moment = require('moment'),
        logger = require('./logger');

    this.getUsersMatchingDate = function (date, callback) {
        var hour = moment(date).hour(),
            minute = moment(date).minute(),
            stmt = db.prepare("SELECT * FROM userNotifications WHERE ");


    };

    this.upsertUserRecord = function (params, callback) {
        //first look up user
        //if exists, update
        //else create new record
    }
};

module.exports = new UserNotificationStorage();