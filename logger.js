var winston = require('winston'),
    slackWinston = require('slack-winston'),
    moment = require('moment'),
    slackWebhook = process.env.SLACK_WEBHOOK || 'n/a',
    logger = new (winston.Logger)({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                colorize: true,
                prettyPrint: true,
                timestamp: function () {
                    return moment().format("MM/DD HH:mm:ss");
                }
            }),
            new slackWinston.Slack({
                domain: 'highground',
                webhook_url: slackWebhook,
                channel: 'chefguslogs',
                silent: slackWebhook === 'n/a',
                level: 'debug'
            })
        ]
    });

module.exports = logger;