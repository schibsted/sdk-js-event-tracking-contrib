'use strict';

module.exports = {
    'Pageload, userId login logout': function (browser) {
        // var chai = require('chai');
        // var uuidv4pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
        var noUserIdResult = {};
        browser
		.deleteCookies()
		.getCookies(function callback(result) {
            this.assert.equal(result.value.length, 0);
        })
        .url('http://127.0.0.1:8080/dev/useridtest/index.html')
        .waitForElementVisible('body', 1000)
        .pause(3000)
        .getCookies(function callback(result) {
            noUserIdResult = result;
            this.assert.equal(result.value[3].name, '_DataTrackerUser');
            this.assert.equal(result.value[3].value, 'undefined');
        })
        .end();
    }
};
