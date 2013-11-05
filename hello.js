/**
 * Created by Kanthanarasimhaiah on 29/10/13.
 */

var binarytree = require("./binarytree"),
    bst = require("./bst");

var tree = new bst.BST();
tree.insert(10,11,12);
console.log(tree.tuple());
console.log(tree.links());

console.log("STATS:", binarytree.STATS);
