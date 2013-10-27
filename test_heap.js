// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_heap.js

var binarytree = require('./binarytree'),
    heaptree = require('./heaptree'),
    heaparray = require('./heaparray');


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
exports.testInsertHeapTree = function(test) {
    insertTests(test, heaptree.HeapTree);
    test.done();
}

exports.testRemoveHeapTree = function(test) {
    insertTests(test, heaptree.HeapTree);
    test.done();
}

// Run with HeapArray
exports.testInsertHeapArray = function(test) {
    insertTests(test, heaparray.HeapArray);
    test.done();
}

exports.testRemoveHeapArray = function(test) {
    insertTests(test, heaparray.HeapArray);
    test.done();
}
