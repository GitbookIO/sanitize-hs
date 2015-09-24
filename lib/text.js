var _ = require('lodash');
var VText = require('virtual-dom').VText;
var isVText = require('virtual-dom/vnode/is-vtext');


// Extract text from a hscript tree
function extractText(tree) {
    if (!_.isArray(tree)) tree = [tree];

    return _.reduce(tree, function(result, entry) {
        if (entry.text) result = result + entry.text;
        if (entry.children) result = extractText(entry.children);

        return result;
    }, '');
}

// Merge consecutive text nodes
function mergeNodes(children) {
    return _.reduce(children, function(list, child, i) {
        if (!isVText(child)) return list.concat([child]);

        var newEl;
        var next = children[i + 1];
        var prev = i > 0? children[i - 1] : undefined;

        if (prev && isVText(prev)) {
            // Already merged
            return list;
        } else if (next && isVText(next)) {
            newEl = new VText(child.text + next.text);
        } else {
            newEl = child;
        }

        return list.concat([newEl]);
    }, []);
}

module.exports = {
    extract: extractText,
    merge: mergeNodes
};

