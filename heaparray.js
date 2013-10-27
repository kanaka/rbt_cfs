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
    api.tuple  = function()      { return heapTuple(self.root); };
    //api.walk   = function(order) { return treeWalk(self.root, order); };
    //api.links  = function()      { return treeLinks(self.root); };
    //api.DOT    = function()      { return treeDOT(self.root); };
    api.walk = api.links = api.DOT = function () {
        throw new Error("not implemented yet");
    }

    if (type === 'min') {
        api.min = function() { return self.root[0]; };
    } else if (type === 'max') {
        api.max = function() { return self.root[0]; };
    } else {
        throw new Error("Heap type must be 'min' or 'max'");
    }
    api.remove = function() {
        self.root = heapRemove(self.root, type, cmpFn);
    }
    self.insertFn = function(tree, node, compareFn) {
        delete node.left;
        delete node.right;
        delete node.p;
        return heapInsert(tree, node, type, cmpFn);
    }

    // Return the API functions (public interface)
    return api;
}

exports.heapTuple = heapTuple;
exports.heapBubbleUp = heapBubbleUp;
exports.heapBubbleDown = heapBubbleDown;
exports.heapInsert = heapInsert;
exports.heapRemove = heapRemove;
exports.HeapArray = HeapArray;
