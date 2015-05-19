/* global server */
'use strict';

module.exports = {
    'Pageload with fake XHR': function (browser) {
        var chai = require('chai');
        browser
        .deleteCookies()
        .getCookies(function callback(result) {
            this.assert.equal(result.value.length, 0);
        })
        .url('http://127.0.0.1:8080/dev/indexObjectTest.html')
        .waitForElementVisible('body', 1000)
        .execute(function() {
            return server.requests;
        }, [''], function(res) {
			this.assert.equal(res.value.length, 2);
			this.assert.equal(res.value[0].requestBody, '{}');
			this.assert.equal(res.value[0].withCredentials, true);
			this.assert.equal(res.value[0].url, 'https://cis.schibsted.com/api/v1/identify');

			var requestBody = JSON.parse(res.value[1].requestBody);

			this.assert.equal(requestBody[0]['@type'], 'Read');
			this.assert.notEqual(requestBody[0]['@context'], undefined);
			this.assert.notEqual(requestBody[0].provider, undefined);
			this.assert.notEqual(requestBody[0].actor, undefined);
			this.assert.notEqual(requestBody[0].object, undefined);
			chai.assert.include(res.value[1].url, '/api/v1/track', 'contains correct relpath');
			chai.assert.include(requestBody[0].object['@id'], 'urn:', 'pageId got urn');
			chai.assert.include(requestBody[0].object['@id'], '1234567', 'pageId passed');
        })
        .pause(1000)
        .execute(function() {
            server.restore();
        }, [''])
        .end();
    }
};