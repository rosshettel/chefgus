'use strict';

var ClusterWrapper = require('./clusterWrapper');

ClusterWrapper.run(function () {
    var scheduler = require('node-schedule'),
        moment = require('moment'),
        logger = require('./logger'),
        contentBuilder = require('./contentBuilder'),
        userStorage = require('./userStorage'),
        slackHandler = require('./slackHandler'),
        mainChannel = process.env.MAIN_CHANNEL || '#testing';

    logger.info('Worker started', moment().format('HH:mm'));

    // 9:45 message to main channel
    scheduler.scheduleJob('45 9 * * 1-5', function () {
        logger.debug('Posting 9:45 notification');
        contentBuilder.buildPayload(mainChannel, function (err, payload) {
            if (err) {
                logger.error('Error getting payload', err);
                return;
            }
            slackHandler.postToSlack(payload);
        });
    });

    // message to individual users, midnight to 9:59 am (fooda order cutoff)
    //scheduler.scheduleJob('* 0-9 * * 1-5', function () {
    scheduler.scheduleJob('* * * * *', function () {
        //look up which users match this time
        userStorage.getUsersMatchingDate(new Date(), function (err, users) {
            if (users.length > 0) {
                logger.debug('Found ' + users.length + ' users for ' + moment().format('HH:mm'));

                users.forEach(function (user) {
                    contentBuilder.buildPayload(user.userid, function (err, payload) {
                        if (err) {
                            logger.error('Error building payload', err);
                            return;
                        }
                        slackHandler.postToSlack(payload);
                    });
                });
            }
        });
    });
});