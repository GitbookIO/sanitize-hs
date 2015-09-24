# sanitize-hs

[![NPM version](https://badge.fury.io/js/sanitize-hs.svg)](http://badge.fury.io/js/sanitize-hs) [![Build Status](https://travis-ci.org/SamyPesse/sanitize-hs.svg?branch=master)](https://travis-ci.org/SamyPesse/html2hs)

Sanitize an [hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript) tree (for [virtual-dom](https://github.com/Matt-Esch/virtual-dom)).

### Installation

```
$ npm install sanitize-hs
```

### Usage

``` js
var sanitize = require('sanitize-hs');

var hscript = sanitize(h("h1", [ "Hello World" ]));
```

`sanitize` also accept an option argument, default values can be found in [defaults.js](https://github.com/SamyPesse/sanitize-hs/blob/master/lib/defaults.js).

### Replacing by escaped text

```js
var sanitize = require('sanitize-hs');
var stringify = require('virtual-dom-stringify');

hscript = sanitize(hscript, {
    replace: function(el) {
        return {
            text: stringify(el)
        };
    }
});
```
