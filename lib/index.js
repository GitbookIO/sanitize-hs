var _ = require('lodash');
var stringify = require('virtual-dom-stringify');


var DEFAULTS = {
    // Replace tags by text or remove?
    removeTags: false,

    // Custom filtering
    isTagAllowed: function(tag, el) { },
    isAttributeAllowed: function(value, key, el) { },

    // List of tags allowed
    allowedTags: [
        'h1', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'
    ],

    // List of attributes allowed for all elements
    allowedAttributes: [
        'id', 'style'
    ],

    // List of allowed attributes per tag
    allowedAttributesPerTag: {
        a: [
            'href', 'name', 'target'
        ],
        img: [
            'src'
        ]
    },

    // List of attributes that require a schema filtering
    schemaAttributes: [ 'scr', 'href' ],

    // Allowed schema for schemaAttributes
    allowedSchemes: [
        'http', 'https', 'ftp', 'mailto'
    ],
};


function sanitize(root, opts) {
    opts = _.defaults(opts || {}, DEFAULTS);

    function cleanup(el) {
        // Text element
        if (!el.tagName) return el;

        var tagName = el.tagName.toLowerCase();

        // Filter tags
        var isAllowed = _.contains(opts.allowedTags, tagName);
        var customIsAllowed = opts.isTagAllowed(tagName, el);
        if (_.isBoolean(customIsAllowed)) isAllowed = customIsAllowed;

        if (!isAllowed) {
            if (opts.removeTags) return null;
            return {
                text: stringify(el)
            };
        }

        // Filter attributes
        if (el.properties) {
            el.properties = _.omit(el.properties, function(value, key) {
                key = key.toLowerCase();

                var isAttrAllowed = _.contains(opts.allowedAttributes, key);
                if (opts.allowedAttributesPerTag[tagName]) {
                    isAttrAllowed = isAttrAllowed || _.contains(opts.allowedAttributesPerTag[tagName], key);
                }
                var customIsAttrAllowed = opts.isAttributeAllowed(value, key, el);
                if (_.isBoolean(customIsAttrAllowed)) isAttrAllowed = customIsAttrAllowed;


                return !isAttrAllowed;
            });
        }

        // Sanitize children
        if (el.children) el.children = _.map(el.children, cleanup);

        return el;
    }

    if (_.isArray(root)) {
        return _.map(root, cleanup);
    } else {
        return cleanup(root);
    }
}

module.exports = sanitize;
module.exports.DEFAULTS = DEFAULTS;
