'use strict';

var MenuStorage = function () {
    var moment = require('moment'),
        logger = require('./logger'),
        Menu = require('./models').Menu;

    this.getMenu = function (date, callback) {
        var today = moment(date).startOf('day'),
            tomorrow = moment(today).add(1, 'days');

        Menu.find({
            date: {
                $gte: today.toDate(),
                $lte: tomorrow.toDate()
            }
        }, function (err, menus) {
            if (err) {
                logger.error('Error finding menus', err);
                return callback(err);
            }

            if (!menus.length) {
                logger.info('No cached menu found for ' + today.toString());
                return callback();
            }

            if (menus.length > 1) {
                logger.warn('Found ' + menus.length + ' cached menus for ' + today.toString());
            }

            callback(null, menus[0].menu);
        });
    };

    this.saveMenu = function (date, menu, callback) {
        var menu = new Menu({
            date: date,
            menu: menu
        });

        menu.save(function (err) {
            if (err) {
                logger.error('Error saving menu', err);
            }

            if (callback) {
                callback(err);
            }
        });
    };
};

module.exports = new MenuStorage();