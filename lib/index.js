var _ = require('lodash');
var stringify = require('virtual-dom-stringify');
var DEFAULTS = require('./defaults');


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
