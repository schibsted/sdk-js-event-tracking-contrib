'use strict';

var activity = {};
var activityOpts = {};
try {
    /* global _opt */
	/* global pulse2opt */
	if (typeof pulse2opt !== 'undefined') {
		activityOpts = pulse2opt;
	} else {
		activityOpts = _opt;
	}
} catch (err) {

}

function initTracking(activityOpts) {
    var Activity = require('../../sdk-js-event-tracking/lib/activity');
    activity = new Activity(activityOpts);

	if (document.readyState === 'complete') {
		trackingFunctions();
	} else {
		window.addEventListener('load', function() {
			trackingFunctions();
		}, false);
	}

    return activity.getPageViewId();
}

module.exports.initTracking = function(activityOpts) {
    initTracking(activityOpts);
};

module.exports.getPageViewId = function() {
    return activity.getPageViewId();
};

module.exports.getVisitorId = function() {
    return activity.getVisitorId();
};

module.exports.getSessionId = function() {
    return activity.getSessionId();
};

module.exports.logoutEvent = function() {
    activity.refreshUserIds();
};

module.exports.loginEvent = function(userId) {
    activity.refreshUserIds(userId);
};

module.exports.activity = function() {
    return activity;
};

function trackingFunctions() {
	console.log('Track page load init');
    var pageEvents = require('./pageLoad');
    pageEvents.pageLoad(activity);
    pageEvents.hashChange(activity);
    pageEvents.pageUnload(activity);

    var click = require('./click');
    click.button(activity);
    click.submit(activity);

    var scrollT = require('./scroll');
    scrollT.trackScrollRelative(activity, 25);
    scrollT.trackScrollItems(activity);

    var social = require('./social');
    social.trackFacebookLikes(activity);
    social.trackFacebookUnlikes(activity);
    social.trackFacebookShares(activity);
    social.trackTwitterShares(activity);
}

try {
    initTracking(activityOpts);
} catch (err) {

}
