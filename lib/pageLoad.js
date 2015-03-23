'use strict';

module.exports.pageLoad = function(activity) {
    activity.events.trackPageLoad().send();
};

module.exports.hashChange = function(activity) {
    document.addEventListener('hashchange', function() {
        activity.events.trackPageLoad().send();
    }, false);
};

module.exports.pageUnload = function(activity) {

    var pageEnterTime = Date.now();
    var unloadFlag = false;

    document.addEventListener('click', function(e) {
        if (!unloadFlag) {
            unloadFlag = true;
            var element = e.target;
            if (element.tagName.toLowerCase() === 'a') {
                var href = element.getAttribute('href');
                var urlPattern = /^https?:\/\//i;
                if (href.match(urlPattern) !== null) {
                    activity.events.trackEngagementTime(Date.now() - pageEnterTime).queue();
                    var exit = activity.events.trackExit('urn:exit:' + href, 'Page');
                    exit.addProperty('secondary', 'url', href);
                    exit.queue();
                    activity.sendQueue();
                }
            }
        }
    }, false);

    window.addEventListener('beforeunload', function() {
        if (!unloadFlag) {
            unloadFlag = true;
            activity.events.trackEngagementTime(Date.now() - pageEnterTime).queue();
            activity.events.trackExit().queue();
            activity.sendQueue();
        }
    });

    window.addEventListener('unload', function() {
        if (!unloadFlag) {
            unloadFlag = true;
            activity.events.trackEngagementTime(Date.now() - pageEnterTime).queue();
            activity.events.trackExit().queue();
            activity.sendQueue();
        }
    }, false);
};
