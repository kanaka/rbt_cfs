// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_bst.js

var rbt = require('./rbt');

NIL = rbt.NIL;


// Give arrays ability to shuffle
// This is the Fisher-Yates shuffle algorithm
Array.prototype.shuffle = function() {
    var i, j, t;
    for (i = this.length-1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        t = this[i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

// Make sure the number of black nodes in every path from node to leaf
// is the same
function checkPaths(node) {
    var left = node.left,
        right = node.right,
        leftCnt = 0,
        rightCnt = 0;

    if (node === NIL) {
        return 1;
    }

    // A red node must not have any red children
    if (node.color === 'r') {
        if (node.left.color === 'r') {
            throw new Error("Node " + node.val + " and left child " + node.left.val + " are both red");
        }
        if (node.right.color === 'r') {
            throw new Error("Node " + node.val + " and right child " + node.left.val + " are both red");
        }
    }

    leftCnt = checkPaths(left);
    rightCnt = checkPaths(right);

    if (leftCnt !== rightCnt) {
        throw new Error("At " + node.val + " left: " + leftCnt + " right: " + rightCnt);
    }

    return leftCnt + ((node.color === 'b') ? 1 : 0);
}


// Make sure that the tree maintains red-black properties
// CLRS 13.1
function checkTree(test, tree, tuples) {

    var root = tree.root();
    
    if (root.color !== 'b') {
        throw new Error("Root of the tree " + root.val + " is red");
    }

    checkPaths(tree.root());

    // If we are given a tuple hierarchy than make sure it matches the
    // tree
    if (tuples) {
        test.deepEqual(tree.tuples(),tuples);
    }
}


exports.testInsert = function(test) {
    var t = new rbt.RBT();
    test.deepEqual(t.tuples(),
                   'NIL');

    t.insert(100);
    checkTree(test,t,
            [100,'b','NIL','NIL']);

    t.insert(80);
    checkTree(test,t,
            [100,'b',[80,'r','NIL','NIL'],
                     'NIL']);

    t.insert(60);
    checkTree(test,t,
            [80,'b',[60,'r','NIL','NIL'],
                    [100,'r','NIL','NIL']]);

    t.insert(110);
    checkTree(test,t,
            [80,'b',[60,'b','NIL','NIL'],
                    [100,'b','NIL',
                                    [110,'r','NIL','NIL']]]);

    var t = new rbt.RBT();

    t.insert(79,74,31,39,68,99,82,72,91,70);
    checkTree(test,t,
            [74,"b",[39,"r",[31,"b",'NIL','NIL'],
                            [70,"b",[68,"r",'NIL','NIL'],
                                    [72,"r",'NIL','NIL']]],
                    [82,"r",[79,"b",'NIL','NIL'],
                            [99,"b",[91,"r",'NIL','NIL'],
                                    'NIL']]]);

    var t = new rbt.RBT();
    t.insert(100,25,80,10,5,18,21,23,14,12,11);
    checkTree(test,t,
            [21,"b",[10,"b",[5,"b",'NIL','NIL'],
                            [14,"r",[12,"b",[11,"r",'NIL','NIL'],
                                            'NIL'],
                                    [18,"b",'NIL','NIL']]],
                    [80,"b",[25,"b",[23,"r",'NIL','NIL'],
                                    'NIL'],
                            [100,"b",'NIL','NIL']]]);
    test.done();

}

exports.testRemove = function(test) {

    var t = new rbt.RBT();
    t.insert(50);
    t.remove(t.search(50));
    checkTree(test,t,'NIL');

    var t = new rbt.RBT();
    t.insert(50,25);
    t.remove(t.search(25));
    checkTree(test,t,
            [50,'b','NIL','NIL']);

    var t = new rbt.RBT();
    t.insert(50,25,40);
    checkTree(test,t,
            [40,'b',[25,'r','NIL','NIL'],
                    [50,'r','NIL','NIL']]);
    t.remove(t.search(40));
    checkTree(test,t,
            [50,'b',[25,'r','NIL','NIL'],
                    'NIL']);

    // Insert is verified above
    var t = new rbt.RBT();
    t.insert(100,25,80,10,5,18,21,23,14,12,11);
    t.remove(t.search(14));
    checkTree(test,t,
            [21,"b",[10,"b",[5,"b",'NIL','NIL'],
                            [12,"r",[11,"b",'NIL','NIL'],
                                    [18,"b",'NIL','NIL']]],
                    [80,"b",[25,"b",[23,"r",'NIL','NIL'],
                                    'NIL'],
                            [100,"b",'NIL','NIL']]])

    t.remove(t.search(5));
    checkTree(test,t,
            [21,"b",[12,"b",[10,"b",'NIL',
                                    [11,"r",'NIL','NIL']],
                            [18,"b",'NIL','NIL']],
                    [80,"b",[25,"b",[23,"r",'NIL','NIL'],
                                    'NIL'],
                            [100,"b",'NIL','NIL']]]);

    t.remove(t.search(21));
    checkTree(test,t,
            [23,"b",[12,"b",[10,"b",'NIL',
                                    [11,"r",'NIL','NIL']],
                            [18,"b",'NIL','NIL']],
                    [80,"b",[25,"b",'NIL','NIL'],
                            [100,"b",'NIL','NIL']]]);

    t.remove(t.search(12));
    checkTree(test,t);

    test.done();
}

function testInOut(test, tree, insOrder, remOrder) {
    for (var i = 0; i < insOrder.length; i++) {
        tree.insert(insOrder[i]);
        checkTree(test, tree);
    }
    for (var i = 0; i < remOrder.length; i++) {
        tree.remove(tree.search(remOrder[i]));
        checkTree(test, tree);
    }
}

exports.testRandom = function(test) {
    // Do the test 10 times
    for (var i = 0; i < 10; i++) {
        var tree = rbt.RBT();
        var insOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].shuffle();
        var remOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].shuffle();
        console.log("Testing - insOrder " + insOrder + " remOrder " + remOrder);
        testInOut(test, tree, insOrder, remOrder);
    }

    test.done();
}
