"use strict";

// Node vs browser behavior
if (typeof module !== 'undefined') {
    var binarytree = require('./binarytree'),
        NIL = binarytree.NIL,
        heaptree = require('./heaptree');
} else {
    var heaparray = {},
        exports = heaparray;
}

// heapArrayInsert: insert the node in the heap array (arr)
function heapArrayInsert (arr, node, type) {
    node.idx = arr.length;
    arr.push(node);

    // Bubble up the new node to its position
    arr = heaptree.heapBubbleUp(arr, node, type);

    return arr;
}

// heapArrayRemove: remove the top element
function heapArrayRemove (arr, node, type) {
    // TODO: assert node is top if set
    if (arr.length <= 1) {
        arr.pop();
    } else {
        // Move the last element to the top
        var n = arr.pop();
        n.idx = 0;
        arr[0] = n;

        // Bubble down the top node to its right position
        arr = heaptree.heapBubbleDown(arr, n, type);
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
        // call parent/super constructor
        api = heaptree.HeapTree.call(self, type, cmpFn),
        arr = [];

    self.Node = function(val, opts) {
        var node = this;
        opts = opts || {};
        opts.arr = arr;
        return binarytree.Node.call(node, val, opts);
    };

    self.__defineGetter__('root', function() {
        if (arr.length > 0) {
            return arr[0];
        } else {
            return NIL;
        }
    });
    self.__defineSetter__('root', function() {
        // No-op
    });

    self.removeFn = function(tree, node) {
        return heapArrayRemove(arr, node, type);
    }
    self.insertFn = function(tree, node) {
        return heapArrayInsert(arr, node, type);
    }

    // Return the API functions (public interface)
    return api;
}

exports.heapArrayInsert = heapArrayInsert;
exports.heapArrayRemove = heapArrayRemove;
exports.HeapArray = HeapArray;
