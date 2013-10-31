"use strict";

var binarytree = require('./binarytree');

// heapTuple: Return a tuple hierarchy in the form: [val,left,right]
// // Note: an empty 'tree' or leaf will return 'NIL'
function heapTuple (arr, idx) {
    idx = idx||0;
    if (idx >= arr.length) {
        return 'NIL';
    }

    var res = [];
    res.push(arr[idx].val);
    res.push(heapTuple(arr, idx*2 + 1));
    res.push(heapTuple(arr, idx*2 + 2));
    return res;
}

// heapReduce
function heapReduce (result, arr, action, order, idx) {
    order = order||"in";  // pre, in, or post
    idx = idx||0;

    if (idx < arr.length) {
        if (order === 'pre') { result = action(result, arr[idx], arr, idx); }
        result = heapReduce(result, arr, action, order, idx*2+1);
        if (order === 'in') { result = action(result, arr[idx], arr, idx); }
        result = heapReduce(result, arr, action, order, idx*2+2);
        if (order === 'post') { result = action(result, arr[idx], arr, idx); }
    }
    return result;
}

// TODO: heapWalk, heapLinks, heapDOT share a lot of code with
// binarytree.js

// treeWalk: Walk the tree and return an array of all the values. The
// walk order depends on order (a string) which may be:
//   'in'   -> in-order walk
//   'pre'  -> pre-order walk
//   'post' -> post-order walk
// Based on INORDER-TREE-WALK definition in CLRS 12.1
function heapWalk (arr, order) {
    return heapReduce([], arr, function(res, node, arr, idx) {
        return res.concat([node.val]);
    }, order);
}

// heapLinks: Return a list of links: [[a, b], [b, c]]
// Note: an empty heap will return null
function heapLinks (arr) {
    return heapReduce([], arr, function(res, n, arr, idx) {
        var links = [];
        if (idx*2 + 1 < arr.length) {
            var n2 = arr[idx*2+1];
            links.push([n.id+"."+n.val, n2.id+"."+n2.val]);
        }
        if (idx*2 + 2 < arr.length) {
            var n2 = arr[idx*2+2];
            links.push([n.id+"."+n.val, n2.id+"."+n2.val]);
        }
        return res.concat(links);
    }, 'pre');
}

// heapDOT: Return DOT graph description
// This can be fed to GraphViz to generate a rendering of the graph.
function heapDOT(arr) {
    var links = heapLinks(arr),
        dot;
    dot = "digraph Heap_Array {\n";
    heapReduce(null, arr, function(_, n, arr, idx) {
        var name = n.id + "." + n.val,
            nleft = arr[idx*2+1],
            nright = arr[idx*2+2];
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


// heapBubbleDown: bubble down the idx element
function heapBubbleDown(arr, idx, type, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = binarytree.defaultCompareFn;
    }
    if (type === 'max') {
        origCompareFn = compareFn;
        compareFn = function(n1, n2) { return - origCompareFn; };
    }


    while (true) {
        var left = 2*idx+1,
            right = 2*idx+2,
            last = arr.length-1;
        var pickChild = null;
        if (left <= last && right <= last) {
            if (compareFn(arr[left], arr[right]) > 0) {
                pickChild = right;
            } else {
                pickChild = left;
            }
        } else if (left <= last) {
            pickChild = left;
        } else {
            break;
        }

        if (compareFn(arr[idx], arr[pickChild]) < 0) {
            break;
        } else {
            var tmp = arr[idx];
            arr[idx] = arr[pickChild];
            arr[pickChild] = tmp;
            idx = pickChild;
        }
    }
    return arr;
}

// heapBubbleUp: bubble up the idx element
function heapBubbleUp(arr, idx, type, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = binarytree.defaultCompareFn;
    }
    if (type === 'max') {
        origCompareFn = compareFn;
        compareFn = function(n1, n2) { return - origCompareFn; };
    }

    while (idx > 0) {
        var pidx = Math.floor((idx-1) / 2);
        if (compareFn(arr[pidx], arr[idx]) < 0) {
            break;
        } else {
            var tmp = arr[idx];
            arr[idx] = arr[pidx];
            arr[pidx] = tmp;
            idx = pidx;
        }
    }
    return arr;
}

// heapInsert: insert the node in the heap array (arr)
function heapInsert (arr, node, type, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = binarytree.defaultCompareFn;
    }

    arr.push(node);

    // Bubble up the new node to its position
    arr = heapBubbleUp(arr, arr.length-1, type, compareFn);

    return arr;
}

// heapRemove: remove the top element
function heapRemove (arr, type, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = binarytree.defaultCompareFn;
    }

    if (arr.length <= 1) {
        arr = [];
    }

    if (arr.length > 1) {
        // Move the last element to the top
        arr[0] = arr.pop();

        // Bubble down the top node to its right position
        arr = heapBubbleDown(arr, 0, type, compareFn);
    }

    return arr;
}



// HeapArray: 
//   - Constructor: new HeapArray (type, cmpFn) - create/construct
//     a new Heap binary tree object. The type can be either 'min' or
//     'max' to create a MinHeap or MaxHeap. If cmpFn is not provided
//     then a numeric comparison is done on nodeX.val.
//   - API/Methods: min (for 'min' tree), max (for 'max' tree), remove
//     (remove top), insert. For debug/output: root.
function HeapArray (type, cmpFn) {
    var self = this,
        api;
    // call parent/super constructor
    api = binarytree.BinaryTree.call(self, cmpFn);

    self.root = [];
    api.root   = function()      { return self.root; };
    api.reduce = function(r,f,o) { return heapReduce(r, self.root, f, o); };
    api.tuple  = function()      { return heapTuple(self.root); };
    api.walk   = function(order) { return heapWalk(self.root, order); };
    api.links  = function()      { return heapLinks(self.root); };
    api.DOT    = function()      { return heapDOT(self.root); };

    if (type === 'min') {
        api.min = function() { return self.root[0]; };
    } else if (type === 'max') {
        api.max = function() { return self.root[0]; };
    } else {
        throw new Error("Heap type must be 'min' or 'max'");
    }
    self.removeFn = function(tree, node, compareFn) {
        return heapRemove(tree, type, type, compareFn);
    }
    self.insertFn = function(tree, node, compareFn) {
        delete node.left;
        delete node.right;
        delete node.p;
        return heapInsert(tree, node, type, compareFn);
    }

    // Return the API functions (public interface)
    return api;
}

exports.heapTuple = heapTuple;
exports.heapReduce = heapReduce;
exports.heapWalk = heapWalk;
exports.heapLinks = heapLinks;
exports.heapDOT = heapDOT;
exports.heapBubbleDown = heapBubbleDown;
exports.heapBubbleUp = heapBubbleUp;
exports.heapInsert = heapInsert;
exports.heapRemove = heapRemove;
exports.HeapArray = HeapArray;
