'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080,
    app = express(),
    logger = require('./logger'),
    slackHandler = require('./slackHandler'),
    userNotificationStorage = require('./userNotificationStorage');

logger.info('Web started');

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