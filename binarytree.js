"use strict";

// Node vs browser behavior
if (typeof module === 'undefined') {
    var binarytree = {},
        exports = binarytree;
}

// defaultCompareFn: The default compare function.
// Returns:
//   0   if node1.val and node2.val are equal
//   < 0 if node1.val < node2.val
//   > 0 if node1.val > node2.val
function defaultCompareFn (node1, node2) {
    return node1.val - node2.val;
}

// Statistics tracking.
var STATS = {};
function GET_STATS () {
    return STATS;
}
function RESET_STATS (vals) {
    vals = vals || {read:  {c: 0, p: 0, l: 0, r: 0, idx: 0, v: 0},
                    write: {c: 0, p: 0, l: 0, r: 0, idx: 0},
                    compare: 0,
                    swap: 0}
    STATS = vals;
}
RESET_STATS();

var NIL;

// The Node object is used as the basis for all the binary tree
// derived structures. Pointer related operations diverge depending on
// whether the tress are linked together using regular pointers or are
// laid out in an array with children at 2i+1 and 2i+2.
function Node(val, opts) {
    var id = Node.nextId++;

    var opts = opts || {},
        cmpFn = opts.cmpFn || defaultCompareFn,
        isNIL = opts.isNIL ? true : false,
        color = opts.color || null,
        p = opts.p || NIL,
        left = opts.left || NIL,
        right = opts.right || NIL,

        // Binary tree stored in an array
        arr = opts.arr || null,
        idx = 0;

    // Common functions/getters/setters. These are wrapped (rather
    // than direct properties) in order to capture statistics about
    // read/write access.
    this.__defineGetter__('id', function() {
        return id;
    });
    this.__defineGetter__('isNIL', function() {
        return isNIL;
    });

    this.__defineGetter__('val', function() {
        STATS.read.v++;
        return val;
    });
    this.__defineSetter__('val', function(arg) {
        throw Error("Cannot set val after insert");
    });

    this.__defineGetter__('color', function() {
        STATS.read.c++;
        return color;
    });
    this.__defineSetter__('color', function(arg) {
        STATS.write.c++;
        color = arg;
    });

    this.__defineGetter__('idx', function() {
        STATS.read.idx++;
        return idx;
    });
    this.__defineSetter__('idx', function(arg) {
        STATS.write.idx++;
        idx = arg;
    });


    // Use the compare function we were initialized with to compare
    // ourself with another node.
    this.cmp = function(other) {
        STATS.compare++;
        return cmpFn(this, other);
    }

    // Divergent based on whether we are a normal tree or using
    // indexed arrays for our trees.
    if (arr) {
        this.__defineGetter__('p', function() {
            STATS.read.p++;
            var pidx = Math.floor((idx-1)/2);
            if (pidx < 0) {
                return NIL;
            } else {
                return arr[pidx];
            }
        });
        this.__defineSetter__('p', function(arg) {
            throw Error("Cannot set p of array based tree");
        });

        this.__defineGetter__('left', function() {
            STATS.read.l++;
            var lidx = 2*idx+1;
            if (lidx > arr.length-1) {
                return NIL;
            } else {
                return arr[lidx];
            }
        });
        this.__defineSetter__('left', function(arg) {
            throw Error("Cannot set left of array based tree");
        });

        this.__defineGetter__('right', function() {
            STATS.read.r++;
            var ridx = 2*idx+2;
            if (ridx > arr.length-1) {
                return NIL;
            } else {
                return arr[ridx];
            }
        });
        this.__defineSetter__('right', function(arg) {
            throw Error("Cannot set right of array based tree");
        });

        this.swap = function(arr, other) {
            STATS.swap++;
            STATS.write.p += 2; // NOTE: not really p, but keep track there
            var nidx = this.idx,
                oidx = other.idx,
                ntmp = this,
                otmp = other;
            arr[nidx] = otmp;
            arr[oidx] = ntmp;
            this.idx = oidx;
            other.idx = nidx;
            return arr;
        };

    } else {
        this.__defineGetter__('p', function() {
            STATS.read.p++;
            return p;
        });
        this.__defineSetter__('p', function(arg) {
            STATS.write.p++;
            p = arg;
        });

        this.__defineGetter__('left', function() {
            STATS.read.l++;
            return left;
        });
        this.__defineSetter__('left', function(arg) {
            STATS.write.l++;
            left = arg;
        });

        this.__defineGetter__('right', function() {
            STATS.read.r++;
            return right;
        });
        this.__defineSetter__('right', function(arg) {
            STATS.write.r++;
            right = arg;
        });

        this.swap = function(tree, other) {
            STATS.swap++;
            var n1 = this, n2 = other;

            if (n1 === NIL || n2 === NIL) {
                throw new Error("Node.swap called with NIL node");
            }

            // If n2 is the parent, then swap them to make the immediate
            // relation logic a single condition
            if (n1.p === n2) {
                var tmp = n1;
                n1 = n2;
                n2 = tmp;
            }

            var p1 = n1.p,
                p2 = n2.p,
                n1left = n1.left,
                n1right = n1.right,
                n2left = n2.left,
                n2right = n2.right;

            // Swap n1 and n2 (up to 12 pointer updates)
            if (n1 === p2) {
                // Adjacent: n1 is immediate parent of n2
                n1.p = n2;
                n2.p = p1;
                n1.left = n2left;
                n1.right = n2right;
                if (n2left !== NIL) {
                    n2left.p = n1;
                }
                if (n2right !== NIL) {
                    n2right.p = n1;
                }
                if (p1 !== NIL) {
                    if (p1.left === n1) {
                        p1.left = n2;
                    } else {
                        p1.right = n2;
                    }
                }
                if (n1left === n2) {
                    n2.left = n1;
                    n2.right = n1right;
                    if (n1right !== NIL) {
                        n1right.p = n2;
                    }
                } else {
                    n2.left = n1left;
                    n2.right = n1;
                    if (n1left !== NIL) {
                        n1left.p = n2;
                    }
                }
            } else {
                // Non-adjacent
                n1.p = p2;
                n2.p = p1;
                n1.left = n2left;
                n1.right = n2right;
                n2.left = n1left;
                n2.right = n1right;
                if (p1 !== NIL) {
                    if (p1.left === n1) {
                        p1.left = n2;
                    } else {
                        p1.right = n2;
                    }
                }
                if (p2 !== NIL) {
                    if (p2.left === n2) {
                        p2.left = n1;
                    } else {
                        p2.right = n1;
                    }
                }
                if (n1left !== NIL) {
                    n1left.p = n2;
                }
                if (n1right !== NIL) {
                    n1right.p = n2;
                }
                if (n2left !== NIL) {
                    n2left.p = n1;
                }
                if (n2right !== NIL) {
                    n2right.p = n1;
                }
            }

            if (tree === n1) {
                return n2;
            } else if (tree === n2) {
                return n1;
            } else {
                return tree;
            }
        }
    }
}
Node.nextId = 0;

// This is the sentinel node that is used instead of null pointers
// (and is always black in the case of red-black trees).
NIL = new Node('NIL', {p: NIL, color: 'b'});

// treeTuple: Return a tuple hierarchy in the form: [val,left,right]
// (or [val,color,left,right] in the case of Red-Black tree)
// Note: an empty tree will return 'NIL'
function treeTuple (tree) {
    if (tree === NIL) {
        return 'NIL';
    }

    var res = [];
    res.push(tree.val);
    if (tree.color) {
        res.push(tree.color);
    }
    res.push(treeTuple(tree.left));
    res.push(treeTuple(tree.right));
    return res;
}

// treeReduce: walk the tree in the order specified, running the
// action function against each node and accumulating the result in
// result. The action function is called with the current result and
// the node that is currently being processed.
// Returns the final reduced result
function treeReduce (result, node, action, order) {
    order = order||"in";  // pre, in, or post

    if (node !== NIL) {
        if (order === 'pre') { result = action(result, node); }
        result = treeReduce(result, node.left, action, order);
        if (order === 'in') { result = action(result, node); }
        result = treeReduce(result, node.right, action, order);
        if (order === 'post') { result = action(result, node); }
    }
    return result;
}

// treeWalk: Walk the tree and return an array of all the values. The
// walk order depends on order (a string) which may be:
//   'in'   -> in-order walk
//   'pre'  -> pre-order walk
//   'post' -> post-order walk
// Based on INORDER-TREE-WALK definition in CLRS 12.1
function treeWalk (tree, order) {
    return treeReduce([], tree, function(res, node) {
        return res.concat([node.val]);
    }, order);
}


// treeLinks: Return a list of links: [[a, b], [b, c]]
// Note: an empty tree will return null
function treeLinks (tree) {
    return treeReduce([], tree, function(res, n) {
        var links = [];
        if (n.left !== NIL) {
            links.push([n.id+"."+n.val, n.left.id+"."+n.left.val]);
        }
        if (n.right !== NIL) {
            links.push([n.id+"."+n.val, n.right.id+"."+n.right.val]);
        }
        return res.concat(links);
    }, 'pre');
}

// treeDOT: Return DOT graph description
// This can be fed to GraphViz to generate a rendering of the graph.
function treeDOT(tree) {
    var dot;
    if ('color' in tree) {
        dot = "digraph Red_Black_Tree {\n";
    } else {
        dot = "digraph Binary_Search_Tree {\n";
    }
    treeReduce(null, tree, function(_,n) {
        dot += "  " + n.id + " [label=" + n.val;
        if (n.color === 'r') {
            dot += " color=red];\n";
        } else {
            dot += " color=black];\n";
        }
        if (n.left !== NIL) {
            dot += "  " + n.id + " -> " + n.left.id + ";\n";
        }
        if (n.right !== NIL) {
            dot += "  " + n.id + " -> " + n.right.id + ";\n";
        }
    }, 'pre');
    dot += "}";
    return dot;
}


// BinaryTree: Binary Tree Object
//   - Constructor: new BinaryTree(cmpFn) - create/construct a new
//     BinaryTree object using cmpFn.  If cmpFn is not provided then
//     a numeric comparison is done on nodeX.val
//   - API/Methods: walk, reduce. For debug/output: root, tuple,
//     links, DOT.
function BinaryTree (cmpFn) {
    if (typeof cmpFn === 'undefined') {
        cmpFn = defaultCompareFn;
    }

    var self = this,
        api = {},
        hashId = 1;
    self.cmpFn = cmpFn;
    self.Node = Node;
    self.root = NIL;
    self.size = 0;
    self.insertFn = function() { throw new Error("No insertFn defined"); };
    self.removeFn = function() { throw new Error("No removeFn defined"); };

    api.root   = function()      { return self.root; };
    api.size   = function()      { return self.size; };
    api.reduce = function(r,f,o) { return treeReduce(r, self.root, f, o); };
    api.tuple  = function()      { return treeTuple(self.root); };
    api.walk   = function(order) { return treeWalk(self.root, order); };
    api.links  = function()      { return treeLinks(self.root); };
    api.DOT    = function()      { return treeDOT(self.root); };
    api.remove = function(node)  {
        self.root = self.removeFn(self.root, node);
        self.size--;
    };
    api.insert = function() {
        // Allow one or more values to be inserted
        if (arguments.length === 1) {
            var node = new self.Node(arguments[0], {cmpFn: self.cmpFn});
            self.root = self.insertFn(self.root, node);
            self.size++;
        } else {
            for (var i = 0; i < arguments.length; i++) {
                var node = new self.Node(arguments[i], {cmpFn: self.cmpFn});
                self.root = self.insertFn(self.root, node);
                self.size++;
            }
        }
    };

    // Return the API functions (public interface)
    return api;
}

exports.defaultCompareFn = defaultCompareFn;
exports.GET_STATS = GET_STATS;
exports.RESET_STATS = RESET_STATS;
exports.Node = Node;
exports.NIL = NIL;
exports.treeTuple = treeTuple;
exports.treeReduce = treeReduce;
exports.treeWalk = treeWalk;
exports.treeLinks = treeLinks;
exports.treeDOT = treeDOT;
exports.BinaryTree = BinaryTree;
