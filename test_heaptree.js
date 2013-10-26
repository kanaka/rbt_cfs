// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_heap.js

var binarytree = require('./binarytree'),
    NIL = binarytree.NIL,
    heaptree = require('./heaptree');

exports.testInsert = function(test) {

    var h = new heaptree.Heap('min');
    h.insert(10);
    test.deepEqual(h.tuples(),
        [10,'NIL','NIL']);

    h.insert(5);
    test.deepEqual(h.tuples(),
        [5,[10,'NIL','NIL'],'NIL']);

    var h = new heaptree.Heap('min');
    h.insert(10,20,30,100);
    test.deepEqual(h.tuples(),
        [10,[20,[100,'NIL','NIL'],
                'NIL'],
            [30,'NIL','NIL']]);

    h.insert(5);
    test.deepEqual(h.tuples(),
        [5,[10,[100,'NIL','NIL'],
               [20,'NIL','NIL']],
            [30,'NIL','NIL']]);

    var h = new heaptree.Heap('min');
    h.insert(10,20,30,100);
    h.insert(15);
    test.deepEqual(h.tuples(),
        [10,[15,[100,'NIL','NIL'],[20,'NIL','NIL']],
            [30,'NIL','NIL']]);

    test.done();
}

exports.testRemove = function(test) {

    var h = new heaptree.Heap('min');
    h.insert(10);
    h.remove();
    test.deepEqual(h.tuples(),
            'NIL');

    var h = new heaptree.Heap('min');
    h.insert(10,20,30,100);
    test.deepEqual(h.tuples(),
        [10,[20,[100,'NIL','NIL'],
                'NIL'],
            [30,'NIL','NIL']]);

    h.remove();
    test.deepEqual(h.tuples(),
        [20,[100,'NIL','NIL'],
            [30,'NIL','NIL']]);

    h.remove();
    test.deepEqual(h.tuples(),
        [30,[100,'NIL','NIL'],
            'NIL']);

    h.remove();
    test.deepEqual(h.tuples(),
        [100,'NIL','NIL']);

    h.remove();
    test.deepEqual(h.tuples(),
        'NIL');

    test.done();
}
