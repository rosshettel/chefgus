"use strict";
var Hipchat = require('node-hipchat'),
	HC = new Hipchat(process.env.hipchat_token),
	mainRoomId = '534478';  // HighGround room id

HC.postMessage({
	room: mainRoomId,
	from: 'Chef Gus',
	message: '(fooda) 15 Minutes left to order Fooda! - https://select.fooda.com/my',
	message_format: 'text',
	notify: 1,
	color: 'green'
}, function (data, err) {
	console.log('sent message', err);
});
