function defaultCompareFn (node1, node2) {
    if (node1.val === node2.val)    { return 0; }
    else if (node1.val < node2.val) { return -1; }
    else                            { return 1; }
}

// CLRS 12.1
function treeWalk (tree, order) {
    order = order||"in";  // pre, in, or post

    var res = [],
        x = (tree && 'p' in tree) ? tree : null;

    if (x !== null) {
        if (order === 'pre') {
            res.push(tree.val);
        }
        res = res.concat(treeWalk(tree.left, order));
        if (order === 'in') {
            res.push(tree.val);
        }
        res = res.concat(treeWalk(tree.right, order));
        if (order === 'post') {
            res.push(tree.val);
        }
    }
    return res;
}

// CLRS 12.2
function treeSearch (tree, value, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = defaultCompareFn;
    }

    if (tree === null || tree.val === undefined
        || compareFn(tree, {val:value}) === 0) {
        return tree;
    } else if (compareFn({val:value}, tree) < 0) {
        return treeSearch(tree.left, value);
    } else {
        return treeSearch(tree.right, value);
    }
}

function treeMin(tree) {
    while (tree.left) {
        tree = tree.left;
    }
    return tree;
}

function treeMax(tree) {
    while (tree.right) {
        tree = tree.right;
    }
    return tree;
}

// CLRS 12.3
function treeInsert (tree, value, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = defaultCompareFn;
    }

    var x = ('p' in tree) ? tree : null,
        y = null,
        z = {val:value,
             left:null,
             right:null,
             p:null};

    while (x !== null) {
        y = x;
        if (compareFn(z, x) < 0) {
            x = x.left;
        } else {
            x = x.right;
        }
    }

    z.p = y;
    if (y === null) {
        // tree was empty
        tree.val = value;
        tree.left = tree.right = tree.p = null;
    } else if (compareFn(z, y) < 0) {
        y.left = z;
    } else {
        y.right = z;
    }
}

function BST (compareFn) {
    var tree = {},
        api = {};

    if (typeof compareFn === 'undefined') {
        compareFn = defaultCompareFn;
    }

    api.walk = function(order) {
        return treeWalk(tree, order);
    };

    api.search = function search(value) {
        return treeSearch(tree, value, compareFn);
    };

    api.min = function() {
        return treeMin(tree);
    };

    api.max = function() {
        return treeMax(tree);
    }

    api.insert = function() {
        if (arguments.length === 1) {
            treeInsert(tree, arguments[0], compareFn);
        } else {
            for (var i = 0; i < arguments.length; i++) {
                treeInsert(tree, arguments[i], compareFn);
            }
        }
    };

    api.remove = function(node) {
    }
    
    api.dump = function() {
        return tree;
    }

    // Return the API functions (public interface)
    return api;
}

exports.BST = BST;
