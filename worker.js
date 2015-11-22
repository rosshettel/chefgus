'use strict';

var scheduler = require('node-schedule'),
    contentBuilder = require('./contentBuilder'),
    userNotificationStorage = require('./userNotificationStorage'),
    logger = require('./logger'),
    slackHandler = require('./slackHandler');

logger.info('Worker started');

scheduler.scheduleJob('45 9 * * 1-5', function () {
    logger.debug('Posting 9:45 notification');
    contentBuilder.buildPayload(function (err, payload) {
        if (err) {
            logger.error('Error getting payload', err);
            return;
        }
        slackHandler.postToSlack(payload);
    });
});

scheduler.scheduleJob('* * * * 1-5', function () {
    logger.debug('Checking for user notifications');
    //look up which users match this time
    //userNotificationStorage.getUsersMatchingDate(new Date(), function)
    //get an array of those users
    //loop through array, build payload, post to slack
});