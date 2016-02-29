'use strict';

var SlackHandler = function () {
    var superagent = require('superagent'),
        logger = require('./logger'),
        moment = require('moment'),
        webhook = process.env.SLACK_WEBHOOK,
        token = process.env.SLACK_TOKEN;

    const MAX_HOUR = 10,
        disableKeywords = [
            'off',
            'disable',
            'diabled',
            'stop'
        ],
        enableKeywords = [
            'start',
            'on',
            ''
        ];

    this.postToSlack = function (payload) {
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

    this.validateSlashPayload = function (payload, callback) {
        if (!payload || payload.token !== token) {
            return callback("Not a valid request");
        }

        if (!payload.user_id) {
            return callback("Didn't get your user id!");
        }

        if (payload.text === 'off' || payload.text === 'disable' || payload.text === 'stop') {
            //we're disabling
            return callback(null, {
                username: payload.user_name,
                userid: payload.user_id,
                enabled: false
            });
        }

        var dateObj = Date.parse(payload.text),
            date = moment(dateObj),
            beforeTime = Date.today().at('10 AM');

        logger.debug('Date passed in', date);

        if (!date.isValid()) {
            return callback("The time you gave is invalid.");
            //todo - return a better string with acceptable input formats
        }

        if (date.isSameOrAfter(beforeTime)) {
            return callback("Can't set a reminder past 10 AM, Fooda no longer accepts orders!");
        }

        callback(null, {
            username: payload.user_name,
            userid: payload.user_id,
            hour: date.hour(),
            minute: date.minute(),
            enabled: true
        });
    };
};

module.exports = new SlackHandler();