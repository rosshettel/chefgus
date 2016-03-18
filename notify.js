'use strict';

var slackHandler = require('./slackHandler'),
    defaultMessage = "Bonjour mes amies! I've added some new functionality I think you might enjoy! I can now remind you privately to order zee Fooda whenever you'd like. Just type `/chefgus 9am` into slack and I'll message you then. Bon appétit, Highground!",
    message = process.argv[2] || defaultMessage;

slackHandler.postToSlack({
    username: 'Chef Gus',
    icon_emoji: ':chefgus:',
    channel: process.env.MAIN_CHANNEL || '#testing',
    text: message
});
