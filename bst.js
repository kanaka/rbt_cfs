// defaultCompareFn: The default compare function.
// Returns:
//   0   if node1.val and node2.val are equal
//   < 0 if node1.val < node2.val
//   > 0 if node1.val > node2.val
function defaultCompareFn (node1, node2) {
    return node1.val - node2.val;
}

// This is the sentinel for Red-Black trees. It's not used in
// constructing BSTs but allows sharing of functions more easily
var NIL = {val:'NIL',
           color:'b',
           left:null,
           right:null,
           p:null};


// treeWalk: Walk the tree and return an array of all the values. The
// walk order depends on order (a string) which may be:
//   'in'   -> in-order walk
//   'pre'  -> pre-order walk
//   'post' -> post-order walk
// Based on INORDER-TREE-WALK definition in CLRS 12.1
function treeWalk (tree, order) {
    order = order||"in";  // pre, in, or post

    var res = [],
        x =  tree;

    if (x !== null && x !== NIL && 'val' in x) {
        if (order === 'pre') {
            res.push(x.val);
        }
        res = res.concat(treeWalk(x.left, order));
        if (order === 'in') {
            res.push(x.val);
        }
        res = res.concat(treeWalk(x.right, order));
        if (order === 'post') {
            res.push(x.val);
        }
    }
    return res;
}

// treeTuple: Return a tuple hierarchy in the form: [val,left,right]
// Note: an empty tree will return null
function treeTuple (tree) {
    if (tree === null || !('val' in tree)) {
        return null;
    }
    if (tree === NIL) {
        return 'NIL';
    }

    var res = [];
    res.push(tree.val);
    if ('color' in tree) {
        res.push(tree.color);
    }
    res.push(treeTuple(tree.left));
    res.push(treeTuple(tree.right));
    return res;
}

// treeSearch: Search the tree for value using compareFn.
// Returns the matching node.
// Based on TREE-SEARCH defintion in CLRS 12.2
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

// treeMin: Return the minimum (left-most) node.
// Based on TREE-MINIMUM definition in CLRS 12.2
function treeMin(tree) {
    while (tree.left !== null && tree.left !== NIL) {
        tree = tree.left;
    }
    return tree;
}

// treeMin: Return the maximum (right-most) node.
// Based on TREE-MAXIMUM definition in CLRS 12.2
function treeMax(tree) {
    while (tree.right !== null && tree.right !== NIL) {
        tree = tree.right;
    }
    return tree;
}

// treeInsert: Add the value to the tree using compareFn to determin
// the placement. Returns new tree (root node could have changed)
// Based on TREE-INSERT definition in CLRS 12.3
function treeInsert (tree, node, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = defaultCompareFn;
    }

    var x = ('val' in tree) ? tree : null,
        y = null,
        z = node;

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
        tree = z;
    } else if (compareFn(z, y) < 0) {
        y.left = z;
    } else {
        y.right = z;
    }
    return tree;
}

// treeTransplant
// Based on TRANSPLANT definition in CLRS 12.3
function treeTransplant(tree, dst, src) {
    var u = dst, v = src;
    if (u.p === null) {
        tree = v;
    } else if (u === u.p.left) {
        u.p.left = v;
    } else {
        u.p.right = v;
    }
    if (v !== null) {
        v.p = u.p;
    }
    return tree;
}

// treeRemove
// Based on TREE-DELETE definition in CLRS 12.3
function treeRemove (tree, node) {
    var z = node,
        y;
    if (z.left === null) {
        tree = treeTransplant(tree,z,z.right);
    } else if (z.right === null) {
        tree = treeTransplant(tree,z,z.left);
    } else {
        y = treeMin(z.right);
        if (y.p !== z) {
            tree = treeTransplant(tree,y,y.right);
            y.right = z.right;
            y.right.p = y;
        }
        tree = treeTransplant(tree,z,y);
        y.left = z.left;
        y.left.p = y;
    }
    return tree;
}

// BST: Binary Search Tree Object
//   - Constructor: new BST(cmpFn) - create/construct a new BST object
//       using cmpFn.  If cmpFn is not provided then a numeric comparison
//       is done on nodeX.val
//   - API/Methods: walk, search, min, max, remove, insert. For
//       debugging: root, tuples.
function BST (cmpFn) {
    if (typeof cmpFn === 'undefined') {
        cmpFn = defaultCompareFn;
    }

    var self = this,
        api = {};
    self.tree = {p:null,left:null,right:null};
    self.insertFn = treeInsert;
    self.removeFn = treeRemove;

    api.walk   = function(order) { return treeWalk(self.tree, order); };
    api.search = function(val)   { return treeSearch(self.tree, val, cmpFn); };
    api.min    = function()      { return treeMin(self.tree); };
    api.max    = function()      { return treeMax(self.tree); };
    api.root   = function()      { return self.tree; };
    api.tuples = function()      { return treeTuple(self.tree); };
    api.remove = function(node)  { self.tree = self.removeFn(self.tree,node); };
    api.insert = function() {
        // Allow one or more values to be inserted
        if (arguments.length === 1) {
            var node = {val:arguments[0],
                        left:null,
                        right:null,
                        p:null};
            self.tree = self.insertFn(self.tree, node, cmpFn);
        } else {
            for (var i = 0; i < arguments.length; i++) {
                var node = {val:arguments[i],
                            left:null,
                            right:null,
                            p:null};
                self.tree = self.insertFn(self.tree, node, cmpFn);
            }
        }
    };

    // Return the API functions (public interface)
    return api;
}

exports.NIL = NIL;
exports.defaultCompareFn = defaultCompareFn;
exports.treeWalk = treeWalk;
exports.treeTuple = treeTuple;
exports.treeSearch = treeSearch;
exports.treeMin = treeMin;
exports.treeMax = treeMax;
exports.treeInsert = treeInsert;
exports.treeTransplant = treeTransplant;
exports.treeRemove = treeRemove;
exports.BST = BST;