'use strict';

var utils = require('./utils');

(function () {
    var MOUSE_FOCUSED_CLASS = 'is-mouse-focused';

    if (window.mouseFocusingInitialized)
        return;

    window.mouseFocusingInitialized = true;

    if (document.readyState == "interactive") {
        addListeners();
    }
    else {
        document.addEventListener('DOMContentLoaded', addListeners);
    }

    function isSvgElement(element) {
        return element.namespaceURI && element.namespaceURI.toLowerCase().indexOf('svg') !== -1;
    }

    function addListeners() {
        var justBlured;
        var wasMouseFocused;
        document.body.addEventListener('mousedown', function (e) {
            var el = e.target;
            var labeledElement;

            // collect clicked element with it's parents before body-element (except svg elements)
            var els = [];
            while (el && el.tagName && el.tagName.toLowerCase() != 'body') {
                if (!isSvgElement(el)) {
                    els.push(el);
                    el.addEventListener('focus', onFocus);

                    // if label element is clicked, bound element can be focused
                    if (el.tagName.toLowerCase() === 'label') {
                        // save element bound to label
                        if (el.getAttribute('for')) {
                            labeledElement = document.getElementById(el.getAttribute('for'));
                        }
                        else {
                            labeledElement = el.querySelector('input');
                        }
                        if (labeledElement) {
                            labeledElement.addEventListener('focus', onFocus);
                            document.addEventListener('mouseup', onMouseUp);
                        }
                    }
                }
                el = el.parentNode;
            }

            // if clicked element has already focused by keyboard
            // wait for `document.activeElement` to change
            setTimeout(function () {
                if (isSvgElement(document.activeElement))
                    return;

                // find focused element
                onFocus.apply(document.activeElement);
            }, 0);

            function onMouseUp() {
                document.removeEventListener('mouseup', onMouseUp);
                if (labeledElement) {
                    // wait while labeled element will be focused
                    // then remove focus listener
                    setTimeout(function () {
                        labeledElement.removeEventListener('focus', onFocus);
                        labeledElement = undefined;
                    }, 0);
                }
            }

            function onFocus() {
                setMouseFocused(this);
                removeFocusListeners();
            }

            function removeFocusListeners() {
                for (var i = 0; i < els.length; i++) {
                    el = els[i];
                    el.removeEventListener('focus', onFocus);
                }
            }
        });

        window.addEventListener('blur', function (e) {
            if (e.target != this)
                return;

            // save element to restore mouse-focused class when this tab will be focused again
            if (justBlured) {
                wasMouseFocused = justBlured;
            }
        }, true);

        window.addEventListener('focus', function () {
            // restore mouse-focused
            if (wasMouseFocused) {
                if (document.activeElement == wasMouseFocused) {
                    setMouseFocused(wasMouseFocused);
                }
                wasMouseFocused = undefined;
            }

        });

        function onBlur() {
            // save element in case when element is blurred with current browser tab blur
            // to restore mouse-focused class when this tab will be focused again
            justBlured = this;
            this.removeEventListener('blur', onBlur);
            utils.removeClass(this, MOUSE_FOCUSED_CLASS);

            // clear justBlured, if this tab was blurred, element should be saved in wasMouseFocused variable
            setTimeout(function () {
                justBlured = undefined;
            }, 0);
        }

        function setMouseFocused(element) {
            // if found and it's not body
            if (element && element.tagName.toLowerCase() != 'body') {
                // add special class, remove it after `blur`
                if(!(!!document.documentMode && element.tagName.toLowerCase() === 'svg')){
                    utils.addClass(element, MOUSE_FOCUSED_CLASS);
                    element.addEventListener('blur', onBlur);
                }
            }
        }
    }

})();
