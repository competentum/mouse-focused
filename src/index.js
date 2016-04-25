'use strict';

var utils = require('./utils');

(function () {
    var MOUSE_FOCUSED_CLASS = 'is-mouse-focused';

    if (window.mouseFocusingInitialized)
        return;

    window.mouseFocusingInitialized = true;

    if (document.readyState == "interactive") {
        addMouseListener();
    }
    else {
        document.addEventListener('DOMContentLoaded', addMouseListener);
    }

    function addMouseListener() {
        document.body.addEventListener('mousedown', function (e) {
            var el = e.target;

            // collect clicked element with it's parents before body-element (except svg elements)
            var els = [];
            do {
                if (!el.namespaceURI || el.namespaceURI.toLowerCase().indexOf('svg') == -1) {
                    els.push(el);
                    el.addEventListener('focus', onFocus);
                }
                el = el.parentNode;
            }
            while (el && el.tagName.toLowerCase() != 'body');

            // if clicked element has already focused by keyboard
            // wait for `document.activeElement` to change
            setTimeout(function () {
                // find focused element
                setMouseFocused(document.activeElement);
            }, 0);

            function onFocus() {
                setMouseFocused(this);
            }

            function onBlur() {
                this.removeEventListener('blur', onBlur);
                utils.removeClass(this, MOUSE_FOCUSED_CLASS);
            }

            function setMouseFocused(element) {
                // if found and it's not body
                if (element && element.tagName.toLowerCase() != 'body') {
                    // add special class, remove it after `blur`
                    utils.addClass(element, MOUSE_FOCUSED_CLASS);
                    element.addEventListener('blur', onBlur);
                }
                removeListeners();
            }

            function removeListeners() {
                for (var i = 0; i < els.length; i++) {
                    el = els[i];
                    el.removeEventListener('focus', onFocus);
                }
            }
        });
    }

})();