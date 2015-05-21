/* global server */
/* global AutoTrack */

'use strict';

module.exports = {
    'Pageload with requirejs': function (browser) {
        var chai = require('chai');
        browser
        .deleteCookies()
        .getCookies(function callback(result) {
            this.assert.equal(result.value.length, 0);
        })
		.url('http://127.0.0.1:8080/dev/requiretests/indexSimple.html')
        .waitForElementVisible('body', 1000)
		.pause(1000)
		.execute(function() {
            return server.requests;
        }, [''], function(res) {
			this.assert.equal(res.value.length, 2);
			var requestBody = JSON.parse(res.value[1].requestBody);
			chai.assert.include(requestBody[0].provider['@id'], 'pulseTest');
        })
		.execute(function() {
			return AutoTrack.getVisitorId();
		}, [''], function(res) {
			this.assert.equal(res.value, 'abcd3456');
		})
		.getCookies(function callback(result) {
            this.assert.equal(result.value.length, 4);

            this.assert.equal(result.value[0].name, '_DataTrackerSession');
            this.assert.equal(result.value[1].name, '_DataTrackerEnv');
            this.assert.equal(result.value[2].name, '_DataTrackerVisitor');
            this.assert.equal(result.value[3].name, '_DataTrackerUser');

			this.assert.equal(result.value[3].value, 'abcd1234');
            this.assert.equal(result.value[0].value, 'abcd2345');
            this.assert.equal(result.value[2].value, 'abcd3456');
            this.assert.equal(result.value[1].value, 'abcd4567');
        })
		.click('body #test-click-element')
		.pause(100)
		.execute(function() {
            return server.requests;
        }, [''], function(res) {
			this.assert.equal(res.value.length, 3);

			var requestBody = JSON.parse(res.value[2].requestBody);

			this.assert.equal(requestBody[0]['@type'], 'Accept');
			this.assert.notEqual(requestBody[0]['@context'], undefined);
			this.assert.notEqual(requestBody[0].provider, undefined);
			this.assert.notEqual(requestBody[0].actor, undefined);
			this.assert.notEqual(requestBody[0].object, undefined);
			chai.assert.include(requestBody[0].object['@id'], 'test-click-element');

        })
		.execute(function() {
            server.restore();
        }, [''])
        .end();
    }
};
