"use strict";

// defaultCompareFn: The default compare function.
// Returns:
//   0   if node1.val and node2.val are equal
//   < 0 if node1.val < node2.val
//   > 0 if node1.val > node2.val
function defaultCompareFn (node1, node2) {
    return node1.val - node2.val;
}

// This is the sentinel node that is used instead of null pointers
// (and is always black in the case of red-black trees).
var NIL = {id:0,
           val:'NIL',
           color:'b',
           left:null,
           right:null,
           p:null};
NIL.p = NIL;

// treeTuple: Return a tuple hierarchy in the form: [val,left,right]
// (or [val,color,left,right] in the case of Red-Black tree)
// Note: an empty tree will return 'NIL'
function treeTuple (tree) {
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

// treeReduce: 
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
    var links = treeLinks(tree),
        dot;
    if ('color' in tree) {
        dot = "digraph Red_Black_Tree {\n";
    } else {
        dot = "digraph Binary_Search_Tree {\n";
    }
    treeReduce(null, tree, function(_, n) {
        var name = n.id + "." + n.val;
        if (n.color === 'r') {
            dot += '  ' + name + " [color=red];\n";
        } else {
            dot += '  ' + name + " [color=black];\n";
        }
    }, 'pre');
    for (var i = 0; i < links.length; i++) {
        var n1 = links[i][0],
            n2 = links[i][1];
        dot += "  " + n1 + " -> " + n2 + ";\n";
    }
    dot += "}";
    return dot;
}

// treeSwap
function treeSwap(tree, n1, n2) {
    if (n1 === NIL || n2 === NIL) {
        throw new Error("treeSwap called with NIL node");
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
    self.root = NIL;
    self.insertFn = function() { throw new Error("No insertFn defined"); };
    self.removeFn = function() { throw new Error("No removeFn defined"); };

    api.root   = function()      { return self.root; };
    api.reduce = function(r,f,o) { return treeReduce(r, self.root, f, o); };
    api.tuple  = function()      { return treeTuple(self.root); };
    api.walk   = function(order) { return treeWalk(self.root, order); };
    api.links  = function()      { return treeLinks(self.root); };
    api.DOT    = function()      { return treeDOT(self.root); };
    api.remove = function(node)  { self.root = self.removeFn(self.root,node); };
    api.insert = function() {
        // Allow one or more values to be inserted
        if (arguments.length === 1) {
            var node = {id:hashId++,
                        val:arguments[0],
                        left:NIL,
                        right:NIL,
                        p:NIL};
            self.root = self.insertFn(self.root, node, cmpFn);
        } else {
            for (var i = 0; i < arguments.length; i++) {
                var node = {id:hashId++,
                            val:arguments[i],
                            left:NIL,
                            right:NIL,
                            p:NIL};
                self.root = self.insertFn(self.root, node, cmpFn);
            }
        }
    };

    // Return the API functions (public interface)
    return api;
}

exports.NIL = NIL;
exports.defaultCompareFn = defaultCompareFn;
exports.treeTuple = treeTuple;
exports.treeReduce = treeReduce;
exports.treeWalk = treeWalk;
exports.treeLinks = treeLinks;
exports.treeDOT = treeDOT;
exports.treeSwap = treeSwap;
exports.BinaryTree = BinaryTree;
