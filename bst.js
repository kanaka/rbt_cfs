// defaultCompareFn: The default compare function.
// Returns:
//   0   if node1.val and node2.val are equal
//   < 0 if node1.val < node2.val
//   > 0 if node1.val > node2.val
function defaultCompareFn (node1, node2) {
    return node1.val - node2.val;
}

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

    if (x !== null && 'val' in x) {
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

    var res = [];
    res.push(tree.val);
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
    while (tree.left) {
        tree = tree.left;
    }
    return tree;
}

// treeMin: Return the maximum (right-most) node.
// Based on TREE-MAXIMUM definition in CLRS 12.2
function treeMax(tree) {
    while (tree.right) {
        tree = tree.right;
    }
    return tree;
}

// treeInsert: Add the value to the tree using compareFn to determin
// the placement. Returns new tree (root node could have changed)
// Based on TREE-INSERT definition in CLRS 12.3
function treeInsert (tree, value, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = defaultCompareFn;
    }

    var x = ('val' in tree) ? tree : null,
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
//       debugging: dump, tuples.
function BST (cmpFn) {
    var tree = {p:null,left:null,right:null},
        api = {};

    if (typeof cmpFn === 'undefined') {
        cmpFn = defaultCompareFn;
    }

    api.walk   = function(order) { return treeWalk(tree, order); };
    api.search = function(val)   { return treeSearch(tree, val, cmpFn); };
    api.min    = function()      { return treeMin(tree); };
    api.max    = function()      { return treeMax(tree); }
    api.dump   = function()      { return tree; }
    api.tuples = function()      { return treeTuple(tree); }
    api.remove = function(node)  { tree = treeRemove(tree,node); }
    api.insert = function() {
        // Allow one or more values to be inserted
        if (arguments.length === 1) {
            tree = treeInsert(tree, arguments[0], cmpFn);
        } else {
            for (var i = 0; i < arguments.length; i++) {
                tree = treeInsert(tree, arguments[i], cmpFn);
            }
        }
    };

    // Return the API functions (public interface)
    return api;
}

exports.BST = BST;
