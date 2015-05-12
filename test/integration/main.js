/* global activity */
'use strict';

module.exports = {
    'Pageload' : function (browser) {
        var chai = require('chai');
        var sinon = require('sinon');
        // var spy = {};
        var noUserIdResult = {};
        var tracker = {foo: 'baz'};
        var tracker2 = {foo: 'bar'};
        browser
        .deleteCookies()
        .getCookies(function callback(result) {
            this.assert.equal(result.value.length, 0);
        })
        .url('http://127.0.0.1:8080/dev/index.html')
        .waitForElementVisible('body', 1000)
        .pause(1000)
        .getCookies(function callback(result) {
            // spy = sinon.spy(AutoTrack.activity, 'transport');
            // console.log(result.value[2]);
            noUserIdResult = result;
            this.assert.equal(result.value.length, 4);
            this.assert.equal(result.value[0].name, '_DataTrackerSession');
            chai.assert.match(result.value[0].value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
            this.assert.equal(result.value[1].name, '_DataTrackerEnv');
            chai.assert.isDefined(result.value[1].value, 'Environment ID was defined in cookie');
            this.assert.equal(result.value[2].name, '_DataTrackerVisitor');
            chai.assert.match(result.value[2].value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
            this.assert.equal(result.value[3].name, '_DataTrackerUser');
            chai.assert.equal(result.value[3].value, 'undefined');
        })
        .execute(function(data) {
            AutoTrack.loginEvent('urn:lol.no:user:234232342');
        }, [''], function(result) {
        })
        .pause(1000)
        .getCookies(function callback(resultNew) {
            // console.log(resultNew.value[2]);
            this.assert.notEqual(resultNew.value[2].value, noUserIdResult.value[2].value);
            this.assert.equal(resultNew.value[2].name, noUserIdResult.value[2].name);
            this.assert.equal(resultNew.value[3].name, '_DataTrackerUser');
            this.assert.equal(resultNew.value[3].value, 'urn:lol.no:user:234232342');
        })
        .execute(function(data) {
            AutoTrack.logoutEvent();
        }, [''])
        .pause(1000)
        .getCookies(function callback(resultNew2) {
            var self = this;
            self.assert.equal(resultNew2.value[2].value, noUserIdResult.value[2].value);
            // Temporary removed due to bug
            self.assert.equal(resultNew2.value[2].name, noUserIdResult.value[2].name);
            self.assert.equal(resultNew2.value[3].name, '_DataTrackerUser');
            self.assert.equal(resultNew2.value[3].value, 'undefined');
        })
        .end();
    }
};
