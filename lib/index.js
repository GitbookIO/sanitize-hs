var _ = require('lodash');
var DEFAULTS = require('./defaults');


function sanitize(root, opts) {
    opts = _.defaults(opts || {}, DEFAULTS);

    function cleanup(el) {
        // Text element
        if (!el.tagName) return el;

        var tagName = el.tagName.toLowerCase();
        var tagAttributes = opts.allowed[tagName];

        if (!tagAttributes && opts.isTagAllowed(tagName, el) !== true) {
            return opts.replace(el);
        }

        // Filter attributes
        if (el.properties) {
            el.properties = _.omit(el.properties, function(value, key) {
                key = key.toLowerCase();

                var isAttrAllowed = _.contains(opts.allowedAttributes, key);
                if (tagAttributes) {
                    isAttrAllowed = isAttrAllowed || _.contains(tagAttributes, key);
                }
                var customIsAttrAllowed = opts.isAttributeAllowed(value, key, el);
                if (_.isBoolean(customIsAttrAllowed)) isAttrAllowed = customIsAttrAllowed;

                return !isAttrAllowed;
            });
        }

        // Sanitize children
        if (el.children) {
            el.children = _.chain(el.children)
                .map(cleanup)
                .compact()
                .value();
        }

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
