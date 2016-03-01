'use strict';

var FoodaAPI = function () {
    var superagent = require('superagent'),
        logger = require('./logger'),
        xSessionToken = process.env.xSessionToken,
        xClientToken = process.env.xClientToken;

    //todo - we shoudl cache this in the DB so we only get it once a day. you're welcome fooda

    this.getLunchToday = function (callback) {
        var dateString = new Date().toISOString().substr(0, 10),
            restaurants;

        superagent.get('http://snappea.fooda.com/api/v1/schedule')
            .query({
                start_date: dateString,
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
                    restaurants = response.body.data.dates[0].meal_periods[0].select_events[0].vendors;
                    callback(null, restaurants);
                } catch (e) {
                    logger.error("Couldn't resolve Fooda vendors");
                    callback("Couldn't resolve vendors");
                }
            });
    };
};

module.exports = new FoodaAPI();