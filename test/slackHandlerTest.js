'use strict';

var slackHandler = require('../slackHandler'),
    assert = require('assert');

describe('Slack Handler Test', function () {
    describe('validateSlashPayload', function () {
        it('should fail if no token', function (done) {
            slackHandler.validateSlashPayload({token: 'bar'}, function (err) {
                assert.equal(err, "Not a valid request");
                done();
            });
        });

        it('should fail if no user_id', function (done) {
            slackHandler.validateSlashPayload({token: 'foo'}, function (err) {
                assert.equal(err, "Didn't get your user id!");
                done();
            });
        });

        it('should pickup disable keywords', function (done) {
            slackHandler.validateSlashPayload({
                token: 'foo',
                user_id: 'bar',
                text: 'off'
            }, function (err, payload) {
                assert.ifError(err);
                assert.equal(payload.userid, 'bar');
                assert.equal(payload.enabled, false);
                done();
            });
        });

        it('should pickup enable keywords', function (done) {
            slackHandler.validateSlashPayload({
                token: 'foo',
                user_id: 'bar',
                text: 'start'
            }, function (err, payload) {
                assert.ifError(err);
                assert.equal(payload.userid, 'bar');
                assert.equal(payload.enabled, true);
                done();
            });
        });

        it('should handle invalid date', function (done) {
            slackHandler.validateSlashPayload({
                token: 'foo',
                user_id: 'bar',
                text: 'sdsfd'
            }, function (err) {
                assert.equal(err, "The time you gave is invalid.");
                done();
            });
        });

        it('should handle date after 10 am', function (done) {
            slackHandler.validateSlashPayload({
                token: 'foo',
                user_id: 'bar',
                text: '10:01 am'
            }, function (err) {
                assert.equal(err, "Can't set a reminder past 10 AM, Fooda no longer accepts orders!");
                done();
            });
        });

        it('should handle valid date input', function (done) {
            slackHandler.validateSlashPayload({
                token: 'foo',
                user_id: 'bar',
                text: '9 am'
            }, function (err, payload) {
                assert.ifError(err);
                assert.equal(payload.userid, 'bar');
                assert.equal(payload.enabled, true);
                assert.equal(payload.hour, 9);
                assert.equal(payload.minute, 0);
                done();
            });
        });

        it('should handle valid date input', function (done) {
            slackHandler.validateSlashPayload({
                token: 'foo',
                user_id: 'bar',
                text: '9:10AM'
            }, function (err, payload) {
                assert.ifError(err);
                assert.equal(payload.userid, 'bar');
                assert.equal(payload.enabled, true);
                assert.equal(payload.hour, 9);
                assert.equal(payload.minute, 10);
                done();
            });
        });

        it('should handle valid date input', function (done) {
            slackHandler.validateSlashPayload({
                token: 'foo',
                user_id: 'bar',
                text: '7:45'
            }, function (err, payload) {
                assert.ifError(err);
                assert.equal(payload.userid, 'bar');
                assert.equal(payload.enabled, true);
                assert.equal(payload.hour, 7);
                assert.equal(payload.minute, 45);
                done();
            });
        });
    });
});