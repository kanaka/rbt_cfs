var bst = require('./bst');

var NIL = bst.NIL;

// CLRS 13.2
function treeLeftRotate(tree,node) {
    var x = node,
        y = x.right;     // set y
    x.right = y.left;    // turn y's left into x's right
    if (y.left !== NIL) {
        y.left.p = x;
    }
    y.p = x.p;           // link x's parent to y
    if (x.p === NIL) {
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
    if (y.right !== NIL) {
        y.right.p = x;
    }
    y.p = x.p;           // link x's parent to y
    if (x.p === NIL) {
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
    while (z.p.color === 'r') {
        if (z.p === z.p.p.left) {
            y = z.p.p.right;
            if (y.color === 'r') {
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
            if (y.color === 'r') {
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
    if (typeof compareFn === 'undefined') {
        compareFn = bst.defaultCompareFn;
    }

    node.color = 'r';

    var x = tree,
        y = NIL,
        z = node;

    while (x !== NIL) {
        y = x;
        if (compareFn(z, x) < 0) {
            x = x.left;
        } else {
            x = x.right;
        }
    }

    z.p = y;
    if (y === NIL) {
        // tree was empty
        tree = z;
    } else if (compareFn(z, y) < 0) {
        y.left = z;
    } else {
        y.right = z;
    }
    z.left = NIL;
    z.right = NIL;
    z.color = 'r';
    tree = redblackInsertFixup(tree, node); // red/black fixup

    return tree;
}

// redblackTransplant
// Based on RB-TRANSPLANT definition in CLRS 13.4
function redblackTransplant(tree, dst, src) {
    var u = dst, v = src;
    if (u.p === NIL) {
        tree = v;
    } else if (u === u.p.left) {
        u.p.left = v;
    } else {
        u.p.right = v;
    }
    v.p = u.p;
    return tree;
}

// CLRS 13.4
function redblackRemoveFixup(tree, node) {
    var x = node,
        w;
    while (x !== tree && x.color === 'b') {
        //console.log("2: x", x.val);
        if (x === x.p.left) {
            w = x.p.right;
            if (w.color === 'r') {
                //console.log("2.1: ", JSON.stringify(bst.treeTuple(tree)));
                // case 1
                w.color = 'b';
                x.p.color = 'r';
                tree = treeLeftRotate(tree,x.p);
                w = x.p.right;
            }
            if (w.left.color === 'b' && w.right.color ==='b') {
                //console.log("2.2: ", JSON.stringify(bst.treeTuple(tree)));
                // case 2
                w.color = 'r';
                x = x.p;
            } else {
                if (w.right.color === 'b') {
                    //console.log("2.3: ", JSON.stringify(bst.treeTuple(tree)));
                    // case 3
                    w.left.color = 'b';
                    w.color = 'r';
                    tree = treeRightRotate(tree,w);
                    w = x.p.right;
                }
                //console.log("2.4: ", JSON.stringify(bst.treeTuple(tree)));
                // case 4
                w.color = x.p.color;
                x.p.color = 'b';
                w.right.color = 'b';
                tree = treeLeftRotate(tree,x.p);
                x = tree;
            }
        } else {
            w = x.p.left;
            if (w.color === 'r') {
                //console.log("3.1: ", JSON.stringify(bst.treeTuple(tree)));
                // case 1
                w.color = 'b';
                x.p.color = 'r';
                tree = treeRightRotate(tree,x.p);
                w = x.p.left;
            }
            if (w.right.color === 'b' && w.left.color ==='b') {
                //console.log("3.2: ", JSON.stringify(bst.treeTuple(tree)));
                // case 2
                w.color = 'r';
                x = x.p;
            } else {
                if (w.left.color === 'b') {
                    //console.log("3.3: ", JSON.stringify(bst.treeTuple(tree)));
                    // case 3
                    w.right.color = 'b';
                    w.color = 'r';
                    tree = treeLeftRotate(tree,w);
                    w = x.p.left;
                }
                //console.log("3.4: ", JSON.stringify(bst.treeTuple(tree)));
                // case 4
                w.color = x.p.color;
                x.p.color = 'b';
                w.left.color = 'b';
                tree = treeRightRotate(tree,x.p);
                x = tree;
            }
        }
        //console.log("4: ", JSON.stringify(bst.treeTuple(tree)));
    }
    x.color = 'b';
    return tree;
}

// CLRS 13.4
// Different enough from treeRemove to deserve it's own function
function redblackRemove(tree, node) {
    var z = node,
        y = z,
        x,
        origColor = y.color;
    //console.log("1 z: ", bst.treeTuple(z));
    if (z.left === NIL) {
        x = z.right;
        //console.log("1.1 x: ", bst.treeTuple(x));
        tree = redblackTransplant(tree,z,z.right);
    } else if (z.right === NIL) {
        x = z.left;
        //console.log("1.2 x: ", bst.treeTuple(x));
        tree = redblackTransplant(tree,z,z.left);
    } else {
        y = bst.treeMin(z.right);
        origColor = y.color;
        x = y.right;
        //console.log("1.3 x: ", bst.treeTuple(x));
        if (x && y.p === z) {
            x.p = y;
        } else {
            tree = redblackTransplant(tree,y,y.right);
            y.right = z.right;
            if (y.right) { y.right.p = y; }
        }
        tree = redblackTransplant(tree,z,y);
        y.left = z.left;
        y.left.p = y;
        y.color = z.color;
    }
    if (x && origColor === 'b') {
        //console.log("1.10 x: ", bst.treeTuple(x));
        tree = redblackRemoveFixup(tree,x);
    }
    return tree;
}

function RBT(cmpFn) {
    if (typeof cmpFn === 'undefined') {
        cmpFn = bst.defaultCompareFn;
    }

    var self = this,
        api = bst.BST.call(self, cmpFn); // call parent constructor
    self.tree = NIL;
    self.tree.p = NIL;
    self.insertFn = redblackInsert;
    self.removeFn = redblackRemove;

    return api;
}

exports.NIL = NIL;
exports.treeLeftRotate = treeLeftRotate;
exports.treeRightRotate = treeRightRotate;
exports.redblackInsertFixup = redblackInsertFixup;
exports.redblackInsert = redblackInsert;
exports.RBT = RBT;
