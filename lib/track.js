'use strict';

// TODO: Find a way to set options file

var activity = {};

module.exports.initTracking = function(opts) {
    var Activity = require('../../sdk-js-event-tracking/lib/activity');

    activity = new Activity(opts);

    window.addEventListener('load', function() {

        var pageEvents = require('./pageLoad');
        pageEvents.pageLoad(activity);
        pageEvents.hashChange(activity);
        pageEvents.pageUnload(activity);

        var click = require('./click');
        click.button(activity);
        click.submit(activity);

        var scrollT = require('./scroll');
        scrollT.trackScrollRelative(activity, 25);
        // TODO: Need to fix this
        scrollT.trackScrollItems(activity);

        var social = require('./social');
        social.trackFacebookLikes(activity);
        social.trackFacebookUnlikes(activity);
        social.trackFacebookShares(activity);
        social.trackTwitterShares(activity);

    }, false);

    return activity.getPageViewId();
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
