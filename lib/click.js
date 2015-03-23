'use strict';

module.exports.button = function(activity) {
    document.addEventListener('click', function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        if (/.*track-click.*/.test(target.className)) {
            activity.events.trackClick(target).send();
        } else {
            var result = searchTrackingClass(target);

            if (result === null) {
                return;
            } else if (!result.obj.id) {
                return;
            } else if (result.type === 'track-form') {
                activity.events.trackForm(result.obj.id, 'Note', 'Post').send();
            } else if (result.type === 'track-comment') {
                activity.events.trackComment(result.obj.id, 'Post').send();
            } else if (result.type === 'track-form') {
                activity.events.trackPoll(result.obj.id, 'Post').send();
            }
        }

    }, false);

    function searchTrackingClass(elem) {

        var parent = elem.parentElement;

        if (parent.nodeName.toUpperCase() === 'HTML') {
            return null;
        } else if (parent.nodeName.toUpperCase() === 'BODY') {
            return null;
        } else if (parent.nodeName === null) {
            return null;
        } else if (parent.className.indexOf('track-form') > -1) {
            return {obj: parent, type: 'track-form'};
        } else if (parent.className.indexOf('track-comment') > -1) {
            return {obj: parent, type: 'track-comment'};
        } else if (parent.className.indexOf('track-poll')) {
            return {obj: parent, type: 'track-poll'};
        } else {
            return searchTrackingClass(elem);
        }
    }

};
