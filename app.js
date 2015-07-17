"use strict";
var superagent = require('superagent'),
    messages = [
        'Bonjour, Il ne reste que 15 minutes à demander le Fooda!',     //15 minutes to order Fooda
        'Quickly! Order zee Fooda! Mangez bien!',
        '15 minutes left for Fooda! Bon appétit!',
        'Compte à rebours à Fooda!',                                    //countdown to Fooda
        'Le temps de demander le Fooda deminue rapidement!',            //the time to order fooda is quickly waning!
        'Si vous voulez manger le Fooda, vous devez agir maintenant!'   //if you want to eat fooda, you must act quickly!
    ];

function whatsForLunchToday(callback) {
    var dateString = new Date().toISOString().substr(0, 10),
        restaurants;

    superagent.get('http://snappea.fooda.com/api/v1/schedule')
        .query({
            start_date: dateString,
            days_with_events: 1
        })
        .set('X-SessionToken', process.env.xSessionToken)
        .set('X-ClientToken', process.env.xClientToken)
        .end(function (err, response) {
            if (err) {
                return callback('Received '+ err.status + ' status code');
            }

            if (response.body.errors && response.body.errors.length > 0) {
                console.log('Fooda returned errors', response.body.errors);
                return callback(response.body.errors);
            }

            try {
                restaurants = response.body.data.dates[0].meal_periods[0].select_events[0].vendors;
                callback(null, restaurants);
            } catch (e) {
                console.log(e);
                callback("Couldn't resolve vendors");
            }
        });
}

whatsForLunchToday(function (err, restaurants) {
    if (err) {
        console.log(err);
    }

    var payload = {
        username: 'Chef Gus',
        icon_emoji: ':chefgus:',
        channel: process.env.testing === 'true' ? '#testing' : '#highground',
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

    superagent.post(process.env.webhook, payload, function (err, res) {
        if (res.status !== 200) {
            console.log('Slack returned non 200 response code', res.body);
            console.log(res.headers);
        }
    });
});