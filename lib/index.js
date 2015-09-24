var _ = require('lodash');

function sanitize(root, opts) {
    opts = _.defaults(opts || {}, {

    });


    return root;
}

module.exports = sanitize;
