var bst = require('./bst');

// redblackTuple: Return a tuple hierarchy in the form:
// [val,color,left,right]
// Note: an empty tree will return null
function redblackTuple(tree) {
    if (tree === null || !('val' in tree)) {
        return null;
    }

    var res = [];
    res.push(tree.val, tree.color);
    res.push(redblackTuple(tree.left));
    res.push(redblackTuple(tree.right));
    return res;
}

// CLRS 13.2
function treeLeftRotate(tree,node) {
    var x = node,
        y = x.right;     // set y
    x.right = y.left;    // turn y's left into x's right
    if (y.left !== null) {
        y.left.p = x;
    }
    y.p = x.p;           // link x's parent to y
    if (x.p === null) {
        tree = y;
    } else if (x === x.p.left) {
        x.p.left = y;
    } else {
        x.p.right = y;
    }
    y.left = x;         // put x on y's left
    x.p = y;

    return tree;
}

// CLRS 13.2
function treeRightRotate(tree,node) {
    var x = node,
        y = x.left;      // set y
    x.left = y.right;    // turn y's right into x's left
    if (y.right !== null) {
        y.right.p = x;
    }
    y.p = x.p;           // link x's parent to y
    if (x.p === null) {
        tree = y;
    } else if (x === x.p.right) {
        x.p.right = y;
    } else {
        x.p.left = y;
    }
    y.right = x;         // put x on y's right
    x.p = y;

    return tree;
}

// CLRS 13.3
function redblackInsertFixup(tree, node) {
    var z = node;
    while (z.p && z.p.color === 'r') {
        if (z.p === z.p.p.left) {
            y = z.p.p.right;
            if (y && y.color === 'r') {
                // case 1
                z.p.color = 'b';
                y.color = 'b';
                z.p.p.color = 'r';
                z = z.p.p;
            } else {
                if (z === z.p.right) {
                    // case 2
                    z = z.p;
                    tree = treeLeftRotate(tree,z);
                }
                z.p.color = 'b';
                z.p.p.color = 'r';
                tree = treeRightRotate(tree,z.p.p);
            }
        } else {
            // same but mirror image
            y = z.p.p.left;
            if (y && y.color === 'r') {
                // case 1
                z.p.color = 'b';
                y.color = 'b';
                z.p.p.color = 'r';
                z = z.p.p;
            } else {
                if (z === z.p.left) {
                    // case 2
                    z = z.p;
                    tree = treeRightRotate(tree,z);
                }
                z.p.color = 'b';
                z.p.p.color = 'r';
                tree = treeLeftRotate(tree,z.p.p);
            }
        }
    }
    tree.color = 'b';
    return tree;
}

// CLRS 13.3
function redblackInsert(tree, node, compareFn) {

    tree = bst.treeInsert(tree, node, compareFn); // call parent function
    node.color = 'r'; // add color
    tree = redblackInsertFixup(tree, node); // red/black fixup

    return tree;
}

function RBT(cmpFn) {
    if (typeof cmpFn === 'undefined') {
        cmpFn = bst.defaultCompareFn;
    }

    var self = this,
        api = bst.BST.call(self, cmpFn); // call parent constructor
    self.tree.color = 'b';

    //api.remove = 
    api.tuples = function()  { return redblackTuple(self.tree); };

    // TODO: almost duplicates code is BST, remove duplication
    api.insert = function () {
        // Allow one or more values to be inserted
        if (arguments.length === 1) {
            var node = {val:arguments[0],
                        left:null,
                        right:null,
                        p:null};
            self.tree = redblackInsert(self.tree, node, cmpFn);
        } else {
            for (var i = 0; i < arguments.length; i++) {
                var node = {val:arguments[i],
                            left:null,
                            right:null,
                            p:null};
                self.tree = redblackInsert(self.tree, arguments[i], cmpFn);
            }
        }
    }

    return api;
}

exports.treeLeftRotate = treeLeftRotate;
exports.treeRightRotate = treeRightRotate;
exports.redblackInsertFixup = redblackInsertFixup;
exports.redblackInsert = redblackInsert;
exports.RBT = RBT;
