// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_heap.js

"use strict";

var binarytree = require('./binarytree'),
    heaptree = require('./heaptree'),
    heaparray = require('./heaparray');


function walkTests(test, Heap) {
    var h = new Heap('min');
    h.insert(10,20,30,100);
    test.deepEqual(h.links(),
        [[10,20],[10,30],[20,100]]);

}

function insertTests(test, Heap) {
    var h = new Heap('min');
    h.insert(10);
    test.deepEqual(h.tuple(),
        [10,'NIL','NIL']);

    h.insert(5);
    test.deepEqual(h.tuple(),
        [5,[10,'NIL','NIL'],'NIL']);

    var h = new Heap('min');
    h.insert(10,20,30,100);
    test.deepEqual(h.tuple(),
        [10,[20,[100,'NIL','NIL'],
                'NIL'],
            [30,'NIL','NIL']]);

    h.insert(5);
    test.deepEqual(h.tuple(),
        [5,[10,[100,'NIL','NIL'],
               [20,'NIL','NIL']],
            [30,'NIL','NIL']]);

    var h = new Heap('min');
    h.insert(10,20,30,100);
    h.insert(15);
    test.deepEqual(h.tuple(),
        [10,[15,[100,'NIL','NIL'],[20,'NIL','NIL']],
            [30,'NIL','NIL']]);

    test.equal(h.reduce(0, function(r, n) { return r+n.val; }),
               175);
}

function removeTests (test, Heap) {
    var h = new Heap('min');
    h.insert(10);
    h.remove();
    test.deepEqual(h.tuple(),
            'NIL');

    var h = new Heap('min');
    h.insert(10,20,30,100);
    test.deepEqual(h.tuple(),
        [10,[20,[100,'NIL','NIL'],
                'NIL'],
            [30,'NIL','NIL']]);

    h.remove();
    test.deepEqual(h.tuple(),
        [20,[100,'NIL','NIL'],
            [30,'NIL','NIL']]);

    h.remove();
    test.deepEqual(h.tuple(),
        [30,[100,'NIL','NIL'],
            'NIL']);

    h.remove();
    test.deepEqual(h.tuple(),
        [100,'NIL','NIL']);

    h.remove();
    test.deepEqual(h.tuple(),
        'NIL');
}

// Run with HeapTree
exports.testWalkHeapTree = function(test) {
    walkTests(test, heaptree.HeapTree);
    test.done();
}

exports.testInsertHeapTree = function(test) {
    insertTests(test, heaptree.HeapTree);
    test.done();
}

exports.testRemoveHeapTree = function(test) {
    insertTests(test, heaptree.HeapTree);
    test.done();
}

// Run with HeapArray
exports.testWalkHeapArray = function(test) {
    walkTests(test, heaparray.HeapArray);
    test.done();
}

exports.testInsertHeapArray = function(test) {
    insertTests(test, heaparray.HeapArray);
    test.done();
}

exports.testRemoveHeapArray = function(test) {
    insertTests(test, heaparray.HeapArray);
    test.done();
}
