'use strict';

var ContentBuilder = function () {
    var foodaAPI = require('./foodaAPI'),
        logger = require('./logger'),
        messages = [
            'Bonjour, Il ne reste que 15 minutes à demander le Fooda!',     //15 minutes to order Fooda
            'Quickly! Order zee Fooda! Mangez bien!',
            '15 minutes left for Fooda! Bon appétit!',
            'Compte à rebours à Fooda!',                                    //countdown to Fooda
            'Le temps de demander le Fooda deminue rapidement!',            //the time to order fooda is quickly waning!
            'Si vous voulez manger le Fooda, vous devez agir maintenant!'   //if you want to eat fooda, you must act quickly!
        ];

    this.buildPayload = function (channel, callback) {
        var payload;

        foodaAPI.getLunchToday(function (err, restaurants) {
            if (err) {
                logger.error('Fooda API error', err);
            }

            payload = {
                username: 'Chef Gus',
                icon_emoji: ':chefgus:',
                channel: channel || '#testing',
                text: messages[Math.floor(Math.random() * messages.length)] + "   :fooda:  <https://select.fooda.com/my|Order now!>"
            };

            if (restaurants) {
                var restaurantList = '• ' + restaurants.map(function (restaurant) {
                        return restaurant.name;
                    }).join('\n • ');

                payload.attachments = [{
                    author_name: 'Restaurants available today',
                    author_link: 'https://select.fooda.com/my',
                    author_icon: 'https://pbs.twimg.com/profile_images/3573354839/4739495b81fe86be4aa3748adf49b94f.png',
                    text: restaurantList,
                    mrkdwn: true
                }];
            }

            //only add comment for user messages
            if (channel.substr(0, 1) !== '#') {
                payload.attachments.push({
                    text: '_Pssst, to stop me bugging you, type `/chefgus stop`_',
                    mrkdwn_in: ["text"]
                });
            } else {
                payload.attachments.push({
                    text: '_Set a custom reminder by using `/chefgus [time]`_',
                    mrkdwn_in: ["text"]
                });
            }

            callback(null, payload);
        });
    }
};

module.exports = new ContentBuilder();
