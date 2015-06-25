"use strict";
var superagent = require('superagent'),
    webhook = process.env.webhook,
    messages = [
        'Bonjour, Il ne reste que 15 minutes à demander le Fooda!',     //15 minutes to order Fooda
        'Quickly! Order zee Fooda! Mangez bien!',
        '15 minutes left for Fooda! Bon appétit!',
        'Compte à rebours à Fooda!',                                    //countdown to Fooda
        'Le temps de demander le Fooda deminue rapidement!',            //the time to order fooda is quickly waning!
        'Si vous voulez manger le Fooda, vous devez agir maintenant!'   //if you want to eat fooda, you must act quickly!
    ],
    payload = {
        username: 'Chef Gus',
        icon_emoji: ':chefgus:',
        channel: '#highground',
        text: messages[Math.floor(Math.random() * messages.length)] + "   :fooda:  <https://select.fooda.com/my|Order now!>"
    };

superagent.post(webhook, payload, function (err, res) {
    if (res.status !== 200) {
        console.log('Slack returned non 200 response code', res.body);
        console.log(res.headers);
    }
});