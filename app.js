'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080,
    app = express(),
    logger = require('./logger'),
    slackHandler = require('./slackHandler'),
    userNotificationStorage = require('./userNotificationStorage');

require('datejs');

logger.info('Web started');

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/slash', function (req, res) {
    logger.debug('slash command payload', req.body);

    function respondWithError(err) {
        logger.error('Responding to slash request with error', {
            error: err,
            body: req.body
        });
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