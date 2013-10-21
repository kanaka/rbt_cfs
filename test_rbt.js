// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_bst.js

var rbt = require('./rbt');

exports.testInsert = function(test) {
    var t = rbt.RBT();
    test.deepEqual(t.tuples(), null);

    t.insert(100);
    test.deepEqual(t.tuples(), [100,'b',null,null]);

    t.insert(80);
    test.deepEqual(t.tuples(), [100,'b',[80,'r',null,null],
                                        null]);

    t.insert(60);
    test.deepEqual(t.tuples(), [80,'b',[60,'r',null,null],
                                       [100,'r',null,null]]);

    t.insert(110);
    test.deepEqual(t.tuples(),[80,'b',[60,'b',null,null],
                                      [100,'b',null,
                                               [110,'r',null,null]]]);
    test.done();

}
