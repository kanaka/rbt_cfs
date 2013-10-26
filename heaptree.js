var binarytree = require('./binarytree'),
    NIL = binarytree.NIL;

function log2(num) {
    return Math.log(num) / Math.log(2);
}

// Find the last element in the tree based on size. Returns
// a tuple of the last element and the parent of the last element.
function heapGetLast(tree, size) {
    if (size === 0) {
        return null;
    } else {
        var parent = tree.p,
            height = Math.floor(log2(size)) + 1,
            sz1 = Math.max(0, (2 << (height - 3)) - 1),
            sz2 = (2 << (height - 2)) - 1,
            sz3 = (2 << (height - 1)) - 1,
            flipAt = (sz2 + sz3) / 2;
        while (size > 1) {
            //console.log("height:", height, "size:", size, "flipAt:", flipAt);
            //console.log("sz1:", sz1, "sz2:", sz2, "sz3:", sz3);
            if (size <= flipAt) {
                //console.log("L");
                parent = tree;
                tree = tree.left;
                size = size - (sz1 + 1);
            } else {
                //console.log("R");
                parent = tree;
                tree = tree.right;
                size = size - (sz2 + 1);
            }
            var new_height = Math.floor(log2(size)) + 1
            if (new_height < height) {
                height = new_height;
                sz3 = sz2;
                sz2 = sz1;
                sz1 = Math.max(0, (2 << (height - 3)) - 1);
                flipAt = (sz2 + sz3) / 2;
            }
        }
        return [tree, parent];
    }
}

// heapBubbleUp
function heapBubbleUp(tree, node, type, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = binarytree.defaultCompareFn;
    }

    if (tree === NIL) {
        return node;
    }

    while (node.p !== NIL) {
        //console.log("node:", node.val, "node.p:", node.p.val);
        var cmp = compareFn(node.p, node);
        if (type === 'max') {
            cmp = - cmp;
        }
        if (cmp < 0) {
            break;
        } else {
            tree = binarytree.treeSwap(tree, node.p, node);
        }
    }
    return tree;
}

// heapInsert:
// Based on XX definition in CLRS YY.Y
function heapInsert (tree, size, node, type, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = binarytree.defaultCompareFn;
    }

    if (tree === NIL) {
        return node;
    }

    var tp = heapGetLast(tree, size + 1),
        parent = tp[1];

    if (parent.left === NIL) {
        parent.left = node;
    } else {
        parent.right = node;
    }
    node.p = parent;

    tree = heapBubbleUp(tree, node, type, compareFn);

    return tree;
}

// heapRemove:
// Based on XX definition in CLRS YY.Y
function heapRemove (tree, size, type, compareFn) {
    if (typeof compareFn === 'undefined') {
        compareFn = binarytree.defaultCompareFn;
    }

    var tp = heapGetLast(tree, size),
        parent = 1;

    return tree;
}



// Heap: 
//   - Constructor: new Heap (type, cmpFn) - create/construct a new
//     Heap binary tree object. The type can be either 'min' or 'max'
//     to create a MinHeap or MaxHeap. If cmpFn is not provided
//     then a numeric comparison is done on nodeX.val.
//   - API/Methods: all BinaryTree methods plus insert and remove
//     (remove top) specific to heaps.
function Heap (type, cmpFn) {
    var self = this,
        api,
        size = 0;
    // call parent/super constructor
    api = binarytree.BinaryTree.call(self, cmpFn);

    if (type === 'min') {
        api.min = function() { return self.root; };
    } else if (type === 'max') {
        api.max = function() { return self.root; };
    } else {
        throw new Error("Heap type must be 'min' or 'max'");
    }
    api.remove = function() {
        self.root = heapRemove(self.root, size--, type);
    }
    self.insertFn = function(tree, node, compareFn) {
        return heapInsert(tree, size++, node, type, compareFn);
    }


    // Return the API functions (public interface)
    return api;
}

exports.heapGetLast = heapGetLast;
exports.heapInsert = heapInsert;
exports.heapRemove = heapRemove;
exports.Heap = Heap;
