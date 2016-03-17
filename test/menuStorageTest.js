'use strict';

var menuStorage = require('../menuStorage'),
    Menu = require('../models').Menu,
    moment = require('moment'),
    assert = require('assert');

describe('MenuStorageTests', function () {
    after(function (done) {
        Menu.remove({}, function (err) {
            assert.ifError(err);
            done();
        });
    });

    describe('saveMenu', function () {
        it('should save a menu', function (done) {
            menuStorage.saveMenu(moment('3/16/16', 'MM/DD/YY').toDate(), {foo: 'bar'}, function (err) {
                assert.ifError(err);
                done();
            });
        });
    });

    describe('getMenu', function () {
        it('should get a menu', function (done) {
            menuStorage.getMenu(moment('3/16/16', 'MM/DD/YY').toDate(), function (err, menu) {
                assert.ifError(err);
                assert(menu);
                assert.equal(menu.foo, 'bar');
                done();
            });
        });

        it('should return null if no menu found', function (done) {
            menuStorage.getMenu(moment('1/1/16', 'MM/DD/YY').toDate(), function (err, menu) {
                assert.ifError(err);
                assert.equal(menu, null);
                done();
            });
        });
    });
});