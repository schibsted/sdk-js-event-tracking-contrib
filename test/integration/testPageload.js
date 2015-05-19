/* global AutoTrack */
'use strict';

module.exports = {
    'Pageload, normal': function (browser) {
        var chai = require('chai');
        var uuidv4pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
        var noUserIdResult = {};
        browser
        .url('http://127.0.0.1:8080/dev/index.html')
        .waitForElementVisible('body', 1000)
		.deleteCookies()
        .getCookies(function callback(result) {
            this.assert.equal(result.value.length, 0);
        })
        .pause(3000)
        .getCookies(function callback(result) {

            noUserIdResult = result;
            this.assert.equal(result.value.length, 4);
            this.assert.equal(result.value[0].name, '_DataTrackerSession');
            chai.assert.match(result.value[0].value, uuidv4pattern);
            this.assert.equal(result.value[1].name, '_DataTrackerEnv');
            chai.assert.isDefined(result.value[1].value, 'Environment ID was defined in cookie');
            this.assert.equal(result.value[2].name, '_DataTrackerVisitor');
            chai.assert.match(result.value[2].value, uuidv4pattern);
            this.assert.equal(result.value[3].name, '_DataTrackerUser');
            chai.assert.equal(result.value[3].value, 'undefined');
        })
        .execute(function() {
            AutoTrack.loginEvent('urn:lol.no:user:234232342');
        }, [''])
        .pause(3000)
        .getCookies(function callback(resultNew) {
			// Removed due to mock-CIS
            // this.assert.notEqual(resultNew.value[2].value, noUserIdResult.value[2].value);
            this.assert.equal(resultNew.value[2].name, noUserIdResult.value[2].name);
            this.assert.equal(resultNew.value[3].name, '_DataTrackerUser');
            this.assert.equal(resultNew.value[3].value, 'urn:lol.no:user:234232342');
        })
        .execute(function() {
            AutoTrack.logoutEvent();
        }, [''])
        .pause(3000)
        .getCookies(function callback(resultNew2) {
            // Removed, waiting for SPTTRAC-50
			// self.assert.equal(resultNew2.value[2].value, noUserIdResult.value[2].value);
            this.assert.equal(resultNew2.value[2].name, noUserIdResult.value[2].name);
            this.assert.equal(resultNew2.value[3].name, '_DataTrackerUser');
            this.assert.equal(resultNew2.value[3].value, 'undefined');
        })
        .end();
    }
};
