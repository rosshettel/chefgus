'use strict';

var ClusterWrapper = require('./clusterWrapper');

ClusterWrapper.run(function () {
    var express = require('express'),
        bodyParser = require('body-parser'),
        moment = require('moment'),
        port = process.env.PORT || 8080,
        app = express(),
        logger = require('./logger'),
        slackHandler = require('./slackHandler'),
        userStorage = require('./userStorage');

    require('datejs');

    logger.info('Web started 🍳');

    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', function (req, res) {
        //this handles slacks SSL check: https://api.slack.com/slash-commands#ssl
        res.sendStatus(200);
    });

    app.post('/slash', function (req, res) {
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

            userStorage.upsertUserRecord(payload, function (err, user) {
                if (err) {
                    return respondWithError(err);
                }
                if (payload.enabled === false) {
                    logger.info(payload.username + ' disabled notifications');
                    res.send({text: "Je comprends, I won't send you any more reminders!"});
                } else {
                    var time = moment().hour(user.hour).minute(user.minute).format('LT');
                    logger.info(payload.username + ' set a reminder for ' + time);
                    res.send({text: "Oui mon ami, I'll remind you at " + time + "!"})
                }
            });
        });
    });

    app.listen(port);
});
