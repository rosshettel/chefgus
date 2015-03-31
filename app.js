"use strict";
var Hipchat = require('node-hipchat'),
	HC = new Hipchat(process.env.hipchat_token),
	mainRoomId = '534478';

HC.postMessage({
	room: '926773',
	from: 'Chef Gus',
	message: '(fooda) 15 Minutes left to order Fooda!',
	message_format: 'text',
	notify: 1,
	color: 'green'
});
