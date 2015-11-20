'use strict';

var SlackHandler = function () {
    var superagent = require('superagent'),
        logger = require('./logger'),
        webhook = process.env.webhook;

    this.postToSlack = function(payload) {
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
        if (!payload || !payload.user_id) {
            return callback("Didn't get your user ID!");
        }

        var date = moment().format('YYYY-MM-DD'),
            dateToParse = date + ' ' + payload.text;

        logger.debug('dateToParse', dateToParse);

        if (!moment(dateToParse).isValid()) {
            return callback("The time you gave is invalid.");
        }

        callback(null, {
            user_name: payload.user_name,
            user_id: payload.user_id,
            date: moment(dateToParse)
        });
    };
};

module.exports = new SlackHandler();