/*!
 * mouse-focused v1.0.7 - Adds specific class ('is-mouse-focused') to DOM-elements which was focused by mouse.
 * repo: https://github.com/competentum/mouse-focused.git
 * (c) 2015-2017 Competentum Group | http://competentum.com
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(2);

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
	                utils.addClass(element, MOUSE_FOCUSED_CLASS);
	                element.addEventListener('blur', onBlur);
	            }
	        }
	    }

	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);