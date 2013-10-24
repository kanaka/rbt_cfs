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
var NIL = {val:'NIL',
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
    return treeReduce([], tree, function(res, node) {
        var links = [];
        if (node.left !== NIL) {
            links.push([node.val, node.left.val]);
        }
        if (node.right !== NIL) {
            links.push([node.val, node.right.val]);
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
        if (n.color === 'r') {
            dot += '  ' + n.val + " [color=red];\n";
        } else {
            dot += '  ' + n.val + " [color=black];\n";
        }
        if (n.left && n.left !== NIL) {
            dot += "  " + n.val + " -> " + n.left.val + ";\n";
        }
        if (n.right && n.right !== NIL) {
            dot += "  " + n.val + " -> " + n.right.val + ";\n";
        }
    }, 'pre');
    dot += "}";
    return dot;
}

// BinaryTree: Binary Tree Object
//   - Constructor: new BinaryTree(cmpFn) - create/construct a new
//     BinaryTree object using cmpFn.  If cmpFn is not provided then
//     a numeric comparison is done on nodeX.val
//   - API/Methods: walk. For debug/output: root, tuples, links, DOT.
function BinaryTree (cmpFn) {
    if (typeof cmpFn === 'undefined') {
        cmpFn = defaultCompareFn;
    }

    var self = this,
        api = {};
    self.root = NIL;
    self.insertFn = function() { throw new Error("No insertFn defined"); };
    self.removeFn = function() { throw new Error("No removeFn defined"); };

    api.walk   = function(order) { return treeWalk(self.root, order); };
    api.root   = function()      { return self.root; };
    api.tuples = function()      { return treeTuple(self.root); };
    api.links  = function()      { return treeLinks(self.root); };
    api.DOT    = function()      { return treeDOT(self.root); };
    api.remove = function(node)  { self.root = self.removeFn(self.root,node); };
    api.insert = function() {
        // Allow one or more values to be inserted
        if (arguments.length === 1) {
            var node = {val:arguments[0],
                        left:NIL,
                        right:NIL,
                        p:NIL};
            self.root = self.insertFn(self.root, node, cmpFn);
        } else {
            for (var i = 0; i < arguments.length; i++) {
                var node = {val:arguments[i],
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
exports.BinaryTree = BinaryTree;
