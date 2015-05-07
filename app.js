"use strict";
var superagent = require('superagent'),
    webhook = process.env.webhook,
    messages = [
        'Bonjour, 15 Minutes ordre de gauche à Fooda!',
        'Quickly! Order zee Fooda! Mangez bien!',
        '15 minutes left for Fooda! Bon appétit!'
    ];

superagent.post(webhook)
    .send({
         username: 'Chef Gus',
         icon_emoji: ':chefgus:',
         channel: '#testing',
         text: messages[Math.floor(Math.random() * messages.length)] + "   :fooda:  <https://select.fooda.com/my|Order now!>"
    }).end(function (err, res) {
        if (res.statusCode !== 200) {
            console.log('Slack returned non 200 response code', res.body);
            console.log(res.headers);
        }
    });