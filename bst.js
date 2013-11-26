"use strict";

// Node vs browser behavior
if (typeof module !== 'undefined') {
    var binarytree = require('./binarytree'),
        NIL = binarytree.NIL;
} else {
    var bst = {},
        exports = bst;
}

// bstSearch: Search the tree for value.
// Returns the matching node.
// Based on TREE-SEARCH defintion in CLRS 12.2
function bstSearch (tree, value) {
    if (tree === NIL) {
        return null;
    } else if (tree.cmp({val:value}) === 0) {
        return tree;
    } else if (tree.cmp({val:value}) > 0) {
        return bstSearch(tree.left, value);
    } else {
        return bstSearch(tree.right, value);
    }
}

// bstMin: Return the maximum (right-most) node or null if the tree
// is empty (NIL).
// Based on TREE-MINIMUM definition in CLRS 12.2
function bstMin(tree) {
    if (tree === NIL) {
        return null;
    }
    while (tree.left !== NIL) {
        tree = tree.left;
    }
    return tree;
}

// bstMax: Return the maximum (right-most) node or null if the tree
// is empty (NIL).
// Based on TREE-MAXIMUM definition in CLRS 12.2
function bstMax(tree) {
    if (tree === NIL) {
        return null;
    }
    while (tree.right !== NIL) {
        tree = tree.right;
    }
    return tree;
}

// bstInsert: Add the value to the tree. Returns new tree (root node
// could have changed)
// Based on TREE-INSERT definition in CLRS 12.3
function bstInsert (tree, node) {
    var x = tree,
        y = NIL,
        z = node;

    while (x !== NIL) {
        y = x;
        if (z.cmp(x) < 0) {
            x = x.left;
        } else {
            x = x.right;
        }
    }

    z.p = y;
    if (y === NIL) {
        // tree was empty
        tree = z;
    } else if (z.cmp(y) < 0) {
        y.left = z;
    } else {
        y.right = z;
    }
    return tree;
}

// bstTransplant
// Based on TRANSPLANT definition in CLRS 12.3
function bstTransplant(tree, dst, src) {
    var u = dst, v = src;
    if (u.p === NIL) {
        tree = v;
    } else if (u === u.p.left) {
        u.p.left = v;
    } else {
        u.p.right = v;
    }
    if (v !== NIL) {
        v.p = u.p;
    }
    return tree;
}

// bstRemove
// Based on TREE-DELETE definition in CLRS 12.3
function bstRemove (tree, node) {
    var z = node,
        y;
    if (z.left === NIL) {
        tree = bstTransplant(tree,z,z.right);
    } else if (z.right === NIL) {
        tree = bstTransplant(tree,z,z.left);
    } else {
        y = bstMin(z.right);
        if (y.p !== z) {
            tree = bstTransplant(tree,y,y.right);
            y.right = z.right;
            y.right.p = y;
        }
        tree = bstTransplant(tree,z,y);
        y.left = z.left;
        y.left.p = y;
    }
    return tree;
}

// BST: Binary Search Tree Object
//   - Constructor: new BST(cmpFn) - create/construct a new BST
//     object. If cmpFn is not provided then a numeric comparison is
//     done on nodeX.val
//   - API/Methods: all binary tree methods plus search, min, max,
//     remove, and insert.
function BST (cmpFn) {
    var self = this,
        // call parent/super constructor
        api = binarytree.BinaryTree.call(self, cmpFn);

    self.insertFn = bstInsert;
    self.removeFn = bstRemove;

    api.search = function(val)   { return bstSearch(self.root, val, cmpFn); };
    api.min    = function()      { return bstMin(self.root); };
    api.max    = function()      { return bstMax(self.root); };

    // Return the API functions (public interface)
    return api;
}

exports.bstSearch = bstSearch;
exports.bstMin = bstMin;
exports.bstMax = bstMax;
exports.bstInsert = bstInsert;
exports.bstTransplant = bstTransplant;
exports.bstRemove = bstRemove;
exports.BST = BST;
