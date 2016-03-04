'use strict';

var scheduler = require('node-schedule'),
    moment = require('moment'),
    contentBuilder = require('./contentBuilder'),
    userStorage = require('./userStorage'),
    logger = require('./logger'),
    slackHandler = require('./slackHandler');

logger.info('Worker started', moment().format('HH:mm'));

process.on('uncaughtException', function (err) {
    logger.error('Uncaught Exception!', err);
    process.exit(1);
});

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

//scheduler.scheduleJob('* 0-9 * * 1-5', function () {
scheduler.scheduleJob('* * * * *', function () {
    //look up which users match this time
    userStorage.getUsersMatchingDate(new Date(), function (err, users) {
        if (users.length > 0) {
            logger.debug('Found ' + users.length + ' users for ' + moment().format('HH:mm'));

            users.forEach(function (user) {
                contentBuilder.buildPayload(function (err, payload) {
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