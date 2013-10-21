// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_bst.js

var bst = require('./bst');

exports.testBasics = function(test) {
    var t = new bst.BST();
    test.deepEqual(t.tuples(), null);

    t.insert(100);
    test.deepEqual(t.tuples(), [100,null,null]);

    t.insert(50);
    test.deepEqual(t.tuples(), [100,[50,null,null],null]);

    t.insert(75);
    test.deepEqual(t.tuples(), [100,[50,null,[75,null,null]],null]);

    test.done();
}

exports.testWalk = function(test) {
    var t = new bst.BST();
    test.deepEqual(t.walk('in'), []);

    t.insert(12,5,18,15,13,1,6);
    test.deepEqual(t.walk('pre'),
                   [12,5,1,6,18,15,13]);
    test.deepEqual(t.walk('in'),
                   [1,5,6,12,13,15,18]);
    test.deepEqual(t.walk('post'),
                   [1,6,5,13,15,18,12]);
    test.done();
} 

exports.testSearch = function(test) {
    var t = new bst.BST();
    test.equal(t.min().val, undefined);
    test.equal(t.max().val, undefined);
    test.equal(t.search(5).val, undefined);

    t.insert(12,5,18,15,13,1,6,4,3,2,19);
    test.equal(t.min().val, 1);
    test.equal(t.max().val, 19);
    test.equal(t.search(5).val, 5);
    test.equal();
    test.done();
} 

exports.testRemove = function(test) {
    // CLRS Figure 12.4 (a)
    var t = new bst.BST();
    t.insert(50,80,60,100);
    test.deepEqual(t.tuples(), [50,null,
                                   [80,[60,null,null],
                                       [100,null,null]]]);
    t.remove(t.search(50));
    test.deepEqual(t.tuples(), [80,[60,null,null],
                                   [100,null,null]]);

    // CLRS Figure 12.4 (b)
    var t = new bst.BST();
    t.insert(50,20,0,40);
    test.deepEqual(t.tuples(), [50,[20,[0,null,null],
                                       [40,null,null]],
                                   null]);
    t.remove(t.search(50));
    test.deepEqual(t.tuples(), [20,[0,null,null],
                                   [40,null,null]]);

    // CLRS Figure 12.4 (c)
    var t = new bst.BST();
    t.insert(50,20,0,40,80,90,85,95);
    test.deepEqual(t.tuples(), [50,[20,[0,null,null],
                                       [40,null,null]],
                                   [80,null,
                                       [90,[85,null,null],
                                           [95,null,null]]]]);
    t.remove(t.search(50));
    test.deepEqual(t.tuples(), [80,[20,[0,null,null],
                                       [40,null,null]],
                                   [90,[85,null,null],
                                       [95,null,null]]]);

    // CLRS Figure 12.4 (d)
    var t = new bst.BST();
    t.insert(50,20,0,40,80,100,60,70,65,75);
    test.deepEqual(t.tuples(), [50,[20,[0,null,null],
                                       [40,null,null]],
                                   [80,[60,null,
                                           [70,[65,null,null],
                                               [75,null,null]]],
                                       [100,null,null]]]);
    t.remove(t.search(50));
    test.deepEqual(t.tuples(), [60,[20,[0,null,null],
                                       [40,null,null]],
                                   [80,[70,[65,null,null],
                                           [75,null,null]],
                                       [100,null,null]]]);

    test.done();
}