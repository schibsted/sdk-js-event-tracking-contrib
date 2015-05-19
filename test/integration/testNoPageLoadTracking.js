/* global activity */
'use strict';

module.exports = {
    'Disabled page load tracking' : function (browser) {
        var chai = require('chai');
        var requests = [];
        browser
        .deleteCookies()
        .getCookies(function callback(result) {
            this.assert.equal(result.value.length, 0);
        })
        .url('http://127.0.0.1:8080/dev/indexNoPageLoadTracking.html')
        .waitForElementVisible('body', 1000)
        .execute(function(data) {
            return server.requests;
        }, [''], function(res) {
			this.assert.equal(res.value.length, 1);
			this.assert.equal(res.value[0].requestBody, '{"userId":"urn:schibsted.com:user:123123"}');
			this.assert.equal(res.value[0].withCredentials, true);
			this.assert.equal(res.value[0].url, 'https://cis.schibsted.com/api/v1/identify');
        })
        .pause(1000)
		.click('body #test-click-element')
		.pause(100)
		.execute(function(data) {
            return server.requests;
        }, [''], function(res) {
			this.assert.equal(res.value.length, 2);
			
			var requestBody = JSON.parse(res.value[1].requestBody);

			this.assert.equal(requestBody[0]['@type'], 'Accept');
			this.assert.notEqual(requestBody[0]['@context'], undefined);
			this.assert.notEqual(requestBody[0].provider, undefined);
			this.assert.notEqual(requestBody[0].actor, undefined);
			this.assert.notEqual(requestBody[0].object, undefined);
			chai.assert.include(requestBody[0].object['@id'], 'test-click-element');
			
        })
        .execute(function(data) {
            server.restore();
        }, [''])
        .end();
    }
};
