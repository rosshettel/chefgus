'use strict';

var assert = require('assert'),
    superagent = require('superagent'),
    server = require('../app'),
    User = require('../models').User,
    host = 'http://localhost:8080';


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
                    assert.equal(res.body.text, "Your notification settings are changed!");

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
                    assert.equal(res.body.text, "Your notification settings are changed!");

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
                    assert.equal(res.body.text, "Your notification settings are changed!");

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