'use strict';

var SlackHandler = function () {
    var superagent = require('superagent'),
        logger = require('./logger'),
        moment = require('moment'),
        webhook = process.env.SLACK_WEBHOOK,
        token = process.env.SLACK_TOKEN || 'foo';

    require('datejs');

    const MAX_HOUR = 10,
        disableKeywords = [
            'off',
            'disable',
            'disabled',
            'stop'
        ],
        enableKeywords = [
            'start',
            'on',
            'enable',
            'enabled'
        ];

    this.postToSlack = function (payload) {
        superagent.post(webhook, payload, function (err, res) {
            if (err) {
                logger.error('Error posting to slack', err);
            }
            if (res.status !== 200) {
                logger.error('Slack returned error', res.error);
            }
        });
    };

    function matchesKeywords(text) {
        return disableKeywords.indexOf(text) > -1 || enableKeywords.indexOf(text) > -1;
    }

    this.validateSlashPayload = function (payload, callback) {
        if (!payload || payload.token !== token) {
            return callback("Not a valid request");
        }

        if (!payload.user_id) {
            return callback("Didn't get your user id!");
        }

        if (matchesKeywords(payload.text)) {
            var enabled = enableKeywords.indexOf(payload.text) > -1;
            callback(null, {
                username: payload.user_name,
                userid: payload.user_id,
                enabled: enabled
            });
        } else {
            var dateObj = Date.parse(payload.text),
                date = moment(dateObj),
                foodaLimit = Date.today().at('10 AM');

            if (!date.isValid()) {
                return callback("Oh merde, the time you gave is invalid!");
                //todo - return a better string with acceptable input formats
            }

            if (date.isSameOrAfter(foodaLimit)) {
                return callback("Pardon, I can't set a reminder past 10 AM. Fooda no longer accepts orders then!");
            }

            callback(null, {
                username: payload.user_name,
                userid: payload.user_id,
                hour: date.hour(),
                minute: date.minute(),
                enabled: true
            });
        }
    };
};

module.exports = new SlackHandler();
