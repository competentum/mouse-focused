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
        document.body.addEventListener('mousedown', function () {
            // wait for `document.activeElement` to change
            setTimeout(function () {
                // find focused element
                var activeElement = document.activeElement;
                // if found and it's not body
                if (activeElement && activeElement.tagName.toLowerCase() != 'body') {
                    // add special class, remove it after `blur`
                    addClass(activeElement, MOUSE_FOCUSED_CLASS);
                    activeElement.addEventListener('blur', onBlur);
                }
            }, 0);
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