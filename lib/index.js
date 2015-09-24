var _ = require('lodash');
var stringify = require('virtual-dom-stringify');


var DEFAULTS = {
    // Replace tags by text or remove?
    removeTags: false,

    // Custom filter
    isTagAllowed: function(tag, elem) { },

    allowedTags: [
        'h1', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'
    ],
    allowedAttributes: {
        a: [
            'href', 'name', 'target'
        ],
        img: [
            'src'
        ]
    },
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

        // Tag is allowed?
        var isAllowed = _.contains(opts.allowedTags, tagName);
        var customIsAllowed = opts.isTagAllowed(tagName, el);
        if (_.isBoolean(customIsAllowed)) isAllowed = customIsAllowed;

        if (!isAllowed) {
            if (opts.removeTags) return null;
            return {
                text: stringify(el)
            };
        }

        // Process children
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
