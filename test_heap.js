// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_heap.js

"use strict";

var binarytree = require('./binarytree'),
    heaptree = require('./heaptree'),
    heaparray = require('./heaparray');

function basicTests(test, Heap) {
    var h = new Heap('min');
    h.insert(12,5,18,15,13,1,6);
    test.deepEqual(h.min().val, 1);
    test.deepEqual(h.size(), 7);

    var h = new Heap('max');
    h.insert(12,5,18,15,13,1,6);
    test.deepEqual(h.max().val, 18);
    test.deepEqual(h.size(), 7);

    test.equal(h.reduce(0, function(r, n) { return r+n.val; }),
               70);
}

function walkTests(test, Heap) {
    var h = new Heap('min');
    h.insert(12,5,18,15,13,1,6);
    test.deepEqual(h.walk('pre'),
                   [1,12,15,13,5,18,6]);
    test.deepEqual(h.walk('in'),
                   [15,12,13,1,18,5,6]);
    test.deepEqual(h.walk('post'),
                   [15,13,12,18,6,5,1]);


    var h = new Heap('max');
    h.insert(12,5,18,15,13,1,6);
    test.deepEqual(h.walk('pre'),
                   [18,15,5,13,12,1,6]);
    test.deepEqual(h.walk('in'),
                   [5,15,13,18,1,12,6]);
    test.deepEqual(h.walk('post'),
                   [5,13,15,1,6,12,18]);
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
exports.testBasicsHeapTree = function(test) {
    basicTests(test, heaptree.HeapTree);
    test.done();
}

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
exports.testBasicsHeapArray = function(test) {
    basicTests(test, heaparray.HeapArray);
    test.done();
}

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
