'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080,
    app = express(),
    scheduler = require('node-schedule'),
    contentBuilder = require('./contentBuilder'),
    userNotificationStorage = require('./userNotificationStorage'),
    logger = require('./logger'),
    slackHandler = require('./slackHandler');

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

app.use(bodyParser.json());

app.get('/', function (req, res) {
    function respondWithError(err) {
        res.send({
            text: "My apologies, I couldn't handle your request", //todo - frenchify this
            attachments: {
                text: err
            }
        });
    }
    slackHandler.validateSlashPayload(req.body, function (err, payload) {
        if (err) {
            return respondWithError(err);
        }

        userNotificationStorage.upsertUserRecord(payload, function (err, response) {
            if (err) {
                return respondWithError(err);
            }
            res.send({text: response});
        });
    });
});

app.listen(port);