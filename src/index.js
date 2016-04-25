'use strict';

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
                    el.addEventListener('focus', onfocus);
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

            function onfocus() {
                setMouseFocused(this);
            }

            function setMouseFocused(element) {
                // if found and it's not body
                if (element && element.tagName.toLowerCase() != 'body') {
                    // add special class, remove it after `blur`
                    addClass(element, MOUSE_FOCUSED_CLASS);
                    element.addEventListener('blur', onBlur);
                }
                removeListeners();
            }

            function removeListeners() {
                for (var i = 0; i < els.length; i++) {
                    el = els[i];
                    el.removeEventListener('focus', onfocus);
                }
            }
        });
    }

    function onBlur() {
        this.removeEventListener('blur', onBlur);
        removeClass(this, MOUSE_FOCUSED_CLASS);
    }

    /**
     *
     * @param {Element} element
     * @param {string} className
     */
    function addClass(element, className) {
        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
        if (re.test(element.className)) return;
        element.className = (element.className + " " + className).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }

    /**
     *
     * @param {Element} element
     * @param {string} className
     */
    function removeClass(element, className) {
        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
        element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }

})();