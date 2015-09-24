var _ = require('lodash');
var FilterCSS = require('cssfilter').FilterCSS;

var cssFilter = new FilterCSS();


var REGEXP_EXPR = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/ig;
var REGEXP_URL = /u\s*r\s*l\s*\(.*/ig;
var REGEXP_JS = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a)\:/ig;


// Sanitize a css string
function sanitizeCSS(value) {
    // Convert to string if needed
    if (_.isObject(value)) value = objectToString(value);

    // expression()
    REGEXP_EXPR.lastIndex = 0;
    if (REGEXP_EXPR.test(value)) {
        return {};
    }

    // url()
    REGEXP_URL.lastIndex = 0;
    if (REGEXP_URL.test(value)) {
        REGEXP_JS.lastIndex = 0;
        if (REGEXP_JS.test(value)) {
            return {};
        }
    }

    value = cssFilter.process(value);

    // Reconvert to object
    return stringToObject(value);
}

// Convert string to object
function stringToObject(value) {
    return _.chain(value)
        .split(";")
        .map(function(rule) {
            var split = rule.split(':');
            if (split.length < 2) return null;
            return [split[0].trim(), split.slice(1).join(':').trim()];
        })
        .compact()
        .object()
        .value();
}

// Convert hscript style (object) to string
function objectToString(value) {
    return _.reduce(value, function(result, value, key) {
        if (result) result = result + ' ';
        return result + key + ': '+value+';';
    }, '');
}

module.exports = {
    sanitize: sanitizeCSS,
    stringToObject: stringToObject,
    objectToString: objectToString
};
