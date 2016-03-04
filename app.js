'use strict';

var ClusterWrapper = require('./clusterWrapper');

ClusterWrapper.run(function () {
    var express = require('express'),
        bodyParser = require('body-parser'),
        port = process.env.PORT || 8080,
        app = express(),
        logger = require('./logger'),
        slackHandler = require('./slackHandler'),
        userStorage = require('./userStorage');

    require('datejs');

    logger.info('Web started');

    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', function (req, res) {
        //this handles slacks SSL check: https://api.slack.com/slash-commands#ssl
        res.sendStatus(200);
    });

    app.post('/slash', function (req, res) {
        logger.debug('slash command payload', req.body);

        function respondWithError(err) {
            logger.error('Responding to slash request with error', {
                error: err,
                requestBody: req.body
            });
            res.send({
                text: err
            });
        }

        slackHandler.validateSlashPayload(req.body, function (err, payload) {
            if (err) {
                return respondWithError(err);
            }

            userStorage.upsertUserRecord(payload, function (err) {
                if (err) {
                    return respondWithError(err);
                }
                //todo - we should send back different messages depending on what changed
                res.send({text: 'Your notification settings are changed!'});
            });
        });
    });

    app.listen(port);
});