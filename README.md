#mouse-focused
 > This script adds specific class ('is-mouse-focused') to DOM-elements which was focused by mouse.
 
 It is common for developers to add css which hides focused element's outline to make html page look prettier. However it makes content unaccessible (see [WAI-ARIA Practices](https://www.w3.org/TR/wai-aria-practices/#kbd_focus)). This script allows to separate focusing from keyboard and mouse. After including it you can use the following code:
 
```css
.is-mouse-focused {
 outline: none;
}
```
This css removes default outline from mouse focused elements. But for users, which use keyboard to navigate, experience will not changed.

[Demo page](https://competentum.github.io/mouse-focused/)

[![NPM][npm-image]][npm-url]

## Installation
Component can be installed with npm:
```
npm install mouse-focused
```

## Usage
Using `require`
```javascript
require('mouse-focused');
```

or simply add script to html
```html
<script type="text/javascript" src="mouse-focused.js"></script>
```

[npm-url]: https://www.npmjs.com/package/mouse-focused
[npm-image]: https://img.shields.io/npm/v/mouse-focused.svg?style=flat-square
