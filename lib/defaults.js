
module.exports = {
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
        ],
        script: [
            'type'
        ]
    },

    // List of attributes that require a schema filtering
    schemaAttributes: [ 'scr', 'href' ],

    // Allowed schema for schemaAttributes
    allowedSchemes: [
        'http', 'https', 'ftp', 'mailto'
    ],
};
