'use strict';

var superagent = require('superagent'),
    scheduler = require('node-schedule'),
    contentBuilder = require('./contentBuilder'),
    logger = require('./logger'),
    webhook = process.env.webhook,
    postToSlack = function (payload) {
        superagent.post(webhook, payload, function (err, res) {
            if (err) {
                logger.error('Error posting to slack', err);
            }
            if (res.status !== 200) {
                logger.error('Slack returned non 200 response code', res.body);
            }
            logger.debug('Slack response', res.body);
        });
    };

scheduler.scheduleJob('45 9 * * 1-5', function () {
    logger.debug('Posting 9:45 notification');
    contentBuilder.buildPayload(function (err, payload) {
        if (err) {
            logger.error('Error getting payload', err);
            return;
        }
        postToSlack(payload);
    });
});

scheduler.scheduleJob('* * * * 1-5', function () {
    logger.debug('Checking for user notifications');
    //look up which users match this time
    //get an array of those users
    //loop through array, build payload, post to slack
});