'use strict';

var FoodaAPI = function () {
    var superagent = require('superagent'),
        logger = require('./logger'),
        menuStorage = require('./menuStorage'),
        xSessionToken = process.env.xSessionToken,
        xClientToken = process.env.xClientToken,
        self = this;

    this.callAPI = function (date, callback) {
        superagent.get('http://snappea.fooda.com/api/v1/schedule')
            .query({
                start_date: date.toISOString().substr(0, 10),
                days_with_events: 1
            })
            .set('X-SessionToken', xSessionToken)
            .set('X-ClientToken', xClientToken)
            .end(function (err, response) {
                if (err) {
                    logger.error('Received ' + err.status + ' status code');
                    return callback('Received ' + err.status + ' status code');
                }

                if (response.body.errors && response.body.errors.length > 0) {
                    logger.error('Fooda returned errors', response.body.errors);
                    return callback(response.body.errors);
                }

                try {
                    var menu = response.body.data.dates[0].meal_periods[0].select_events[0].vendors;
                    callback(null, menu);
                } catch (e) {
                    logger.error("Couldn't resolve Fooda vendors");
                    callback("Couldn't resolve vendors");
                }
            });
    };

    this.getLunchToday = function (callback) {
        var today = new Date();

        menuStorage.getMenu(today, function (err, menu) {
            if (err || !menu) {
                self.callAPI(today, function (err, menu) {
                    if (err) {
                        logger.error("Couldn't get Fooda menu!", err);
                        return callback(err);
                    }

                    menuStorage.saveMenu(today, menu);

                    callback(null, menu);
                });
            } else {
                callback(null, menu)
            }
        });
    };
};

module.exports = new FoodaAPI();