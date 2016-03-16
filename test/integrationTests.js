'use strict';
process.env.NODE_ENV = 'test';

var assert = require('assert'),
    superagent = require('superagent'),
    User = require('../models').User,
    host = 'http://localhost:8080',
    server = require('../app');

describe('IntegrationTests', function () {
    describe('Slash command', function () {
        it('should do error if not a valid request', function (done) {
            superagent.post(host + '/slash')
                .send({})
                .end(function (err, res) {
                    assert.ifError(err);
                    assert.equal(res.body.text, "Not a valid request");
                    done();
                });
        });

        it('should return an error if not a valid time', function (done) {
            superagent.post(host + '/slash')
                .send({
                    token: 'foo',
                    user_id: '12345',
                    user_name: 'testuser',
                    text: 'foobar'
                })
                .type('application/x-www-form-urlencoded')
                .end(function (err, res) {
                    assert.ifError(err);
                    assert.equal(res.body.text, "Oh merde, the time you gave is invalid!");
                    done();
                });
        });

        it('should return an error if past 10 am', function (done) {
            superagent.post(host + '/slash')
                .send({
                    token: 'foo',
                    user_id: '12345',
                    user_name: 'testuser',
                    text: '10:15 am'
                })
                .type('application/x-www-form-urlencoded')
                .end(function (err, res) {
                    assert.ifError(err);
                    assert.equal(res.body.text, "Pardon, I can't set a reminder past 10 AM. Fooda no longer accepts orders then!");
                    done();
                });
        });

        it('should update a valid request', function (done) {
            superagent.post(host + '/slash')
                .send({
                    token: 'foo',
                    user_id: '12345',
                    user_name: 'testuser',
                    text: '9:35 am'
                })
                .type('application/x-www-form-urlencoded')
                .end(function (err, res) {
                    assert.ifError(err);
                    assert.equal(res.body.text, "Oui mon ami, I'll remind you then!");

                    User.findOne({username: 'testuser'}, function (err, user) {
                        assert.ifError(err);
                        assert(user);
                        assert.equal(user.hour, 9);
                        assert.equal(user.minute, 35);
                        done();
                    });
                });
        });

        it('should disable a user', function (done) {
            superagent.post(host + '/slash')
                .send({
                    token: 'foo',
                    user_id: '12345',
                    user_name: 'testuser',
                    text: 'disabled'
                })
                .type('application/x-www-form-urlencoded')
                .end(function (err, res) {
                    assert.ifError(err);
                    assert.equal(res.body.text, "Je comprends, I won't send you any more reminders!");

                    User.findOne({username: 'testuser'}, function (err, user) {
                        assert.ifError(err);
                        assert(user);
                        assert.equal(user.hour, 9);
                        assert.equal(user.minute, 35);
                        assert.equal(user.enabled, false);
                        done();
                    });
                });
        });

        it('should enable a user', function (done) {
            superagent.post(host + '/slash')
                .send({
                    token: 'foo',
                    user_id: '12345',
                    user_name: 'testuser',
                    text: 'start'
                })
                .type('application/x-www-form-urlencoded')
                .end(function (err, res) {
                    assert.ifError(err);
                    assert.equal(res.body.text, "Oui mon ami, I'll remind you then!");

                    User.findOne({username: 'testuser'}, function (err, user) {
                        assert.ifError(err);
                        assert(user);
                        assert.equal(user.hour, 9);
                        assert.equal(user.minute, 35);
                        assert.equal(user.enabled, true);
                        done();
                    });
                });
        });

    });
});