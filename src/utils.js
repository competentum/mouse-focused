'use strict';

module.exports = {

    /**
     *
     * @param {Element} element
     * @param {string} className
     */
    addClass: function addClass(element, className) {
        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
        if (re.test(element.className)) return;
        element.className = (element.className + " " + className).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    },

    /**
     *
     * @param {Element} element
     * @param {string} className
     */
    removeClass: function removeClass(element, className) {
        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
        element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }
};