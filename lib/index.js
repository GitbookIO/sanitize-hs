var _ = require('lodash');
var virtualDom = require('virtual-dom');
var isVNode = require('virtual-dom/vnode/is-vnode');

var DEFAULTS = require('./defaults');
var text = require('./text');

var VText = virtualDom.VText;


function sanitize(root, opts) {
    opts = _.defaults(opts || {}, DEFAULTS);

    function cleanup(el) {
        if (!isVNode(el)) return el;

        var tagName = el.tagName.toLowerCase();
        var tagAttributes = opts.allowed[tagName];

        if (!tagAttributes && opts.isTagAllowed(tagName, el) !== true) {
            var el = opts.replace(el);
            if (_.isString(el)) el = new VText(el);
            return el;
        }

        // Filter attributes
        if (el.properties) {
            el.properties = _.chain(el.properties)
                .map(function(value, key) {
                    key = key.toLowerCase();

                    // Check if attribute is allowed for this element
                    var isAttrAllowed = _.contains(opts.allowedAttributes, key);
                    if (tagAttributes) {
                        isAttrAllowed = isAttrAllowed || _.contains(tagAttributes, key);
                    }

                    // Check if schemas is allowed
                    if (_.contains(opts.schemaAttributes, key)) {
                        isAttrAllowed = !!_.find(opts.allowedSchemes, function(schema) {
                            return value.substr(0, schema.length) === schema;
                        });
                    }

                    // Check if the attributes is allowed by custom rules
                    var customIsAttrAllowed = opts.isAttributeAllowed(value, key, el);
                    if (_.isBoolean(customIsAttrAllowed)) isAttrAllowed = customIsAttrAllowed;

                    if (!isAttrAllowed) return null;

                    // Sanitize attributes if needed
                    if (opts.sanitizeAttributes[key]) {
                        value = opts.sanitizeAttributes[key](value, key);
                    }


                    return [key, value];
                })
                .compact()
                .object()
                .value();
        }

        // Sanitize children
        if (el.children) {
            el.children = _.chain(el.children)
                .map(cleanup)
                .compact()
                .value();

            // Merge consecutive text
            el.children = text.merge(el.children);

            // Update count property
            el.count = _.sum(el.children, function(child) {
                return 1 + (child.count || 0);
            });
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

