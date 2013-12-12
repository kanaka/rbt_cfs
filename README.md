# CSE5311 Project

## Overview

This project is a Javascript implementation of a CPU scheduler and
four data structures for use as the future task timeline: Binary
Search Tree (unbalanced), Red-Black Tree, Heap Tree, and Heap Array.
When the scheduler is using the RBT data structure for the timeline,
this models the Linux Completely Fair Scheduler (CFS).

## Running the code

* Prerequisites:
  * You need to install [Node.js](http://nodejs.org)
  * Unpacked project directory
  * To run the unit tests you also need to install the nodeunit
    module. Use npm from the project directory:

```
npm install nodeunit
```

* Load a simple file with 3 tasks, run the scheduler using a simple
  (unbalanced) Binary Search Tree for the timeline, and generate
  a brief report (elapsed time, throughput, tree operations).

```
node ./scheduler.js --report bst data/simple3.txt
```

* Load a more complicated tasks file, run the scheduler using
  a Red-Black Tree for the timeline, and generate a summary of the
  state of the timline and a list of the tasks that ran at each time
  unit:

```
node scheduler.js --summary rbt data/mixed12.txt
```

* Load a larger task file (20 tasks), run the scheduler using
  a Red-Black Tree for the timeline, and generate a detailed report
  (starting tasks, running/completed task at each tick, in addition to
  information from --report):

```
node ./scheduler.js --detailed rbt data/IncrementalSTdiffRT.txt
```

* Generate 9 different sets of tasks (with 2^2 through 2^10 tasks),
  run the scheduler against each task set using a HeapTree for the
  timeline, and generate CSV formatted output (one line per task set):

```
node ./run_tasks.js --csv heaptree 2 10
```

* Load a tasks file with 8 tasks, run the scheduler using a HeapArray
  for the timeline, and generate CSV output with one line for each
  simulation time unit that contains fairness ratios for every task.

```
node ./run_tasks_fairness.js heaparray data/flat8.txt
```

* Run all the unit tests using nodeunit:

```
node node_modules/nodeunit/bin/nodeunit test_*
```


## Design

There are several competing goals that must be balanced in scheduler
design. The two that are considered by this project are fairness and
throughput.

### Fairness

Fairness is a measure of how close the scheduler approximates
a perfectly and infinitely subdividable CPU. In other words, if there
are N task that all started at the same time and have the same
duration, then each task should have received exactly 1/Nth of the CPU
runtime at every point in the tasks lifecycle. Real CPUs (even SMP
CPUs) are not infinitely subdividable and as such only approximate
perfectly fairness. Contrary to the name, the Completely Fair
Scheduler is still an approximately of a 100% fair scheduler where the
average fairness (or unfairness) across all tasks approaches
completely fair over time.

### Throughput

Throughput is a measure of the efficiency (low overhead) of the
scheduler. Maximal throughput is achieved if the scheduler keeps
allows the CPU to allocate 100% of its processing power to actual
tasks. In other words, any time that the CPU is running the
scheduler rather than the tasks to be scheduled is overhead that
decreases throughput.


## Algorithm Description

### Scheduler

The scheduler (runScheduler in scheduler.js) algorithm performs the
following tasks in a loop (where curTime is the current tick/time
unit):

- Add any tasks to the timeline structure that have a start time equal
  to curTime.
- If there is a running task and it is no longer the most unfair task,
  then put it back to the timline.
- If there is no running task and there are tasks on the timeline,
  remove the most unfair task from the timeline (the left-most in
  a BST and RBT, and the top in a Min Heap) and set it as the running
  task.
- Execute the running task
- If the running task is complete (its runtime has reached its
  duration), then mark it as completed and stop running it.

### Timeline Interface

Each of the data structures that can be used as a scheduler timeline
provide the following interface:

- min() - return the tree node containing the task which is currently
  the most unfair (the smallest vruntime value)
- insert() - insert a task into the tree based on that task's vruntime
  value.
- remove() - remove a given tree node from the tree.

### Node (binarytree.js)

Each of the timeline tree data structures is implemented using the
Node class (Node in binarytree.js) to represents nodes in the tree.
All operations on the tree are performed in terms of the Node class.
Some of the Node operations/attributes (swap, p, left, right) behave
differently depending on whether the data structure is constructed
using references (BST, RBT, HeapTree) or using a flat array structure
(HeapArray).

The Node class provides the following attributes:

- id    : A unique node ID. Used for distinguishing node which have an
          identical value.
- isNIL : Set to true if this is a special NIL sentinel node, false
          otherwise.
- val   : The actual value of the node. In the case of the scheduler
          timeline, this holds the task object/map.
- color : The color of this node. Only applicable to Red-Black Tree.
- idx   : The array index of this node if it is being used in
          a data structure that is array backed.
- p     : A reference to the parent of this Node.
- left  : A reference to the left child of this Node.
- right : A reference to the right child of this Node.

In addition the Node class provides two methods:

- cmp   : Called with another Node; returns -1 if this Node is less
          than the other Node, 0 if it is equal, and 1 if it is
          greater than the other Node.
- swap  : Called with another Node; swap position with the other Node.

From the perspective of the Node class, the val attribute is an opaque
object. In order to compare this Node to another Node, when a Node is
instantiated it is given a compare function which allows is to compare
two Node val properties.

Since all the binary tree data structures use the Node class to
construct the tree, the Node class is used to gather statistics on the
operations that are performanced against the tree.


### BinaryTree (binarytree.js)

BinaryTree is a generic class that implements methods that are common
to all of the binary trees data structures:

- size   : Returns the number of non-NIL nodes in the tree.
- reduce : Returns a reduced value that results from running an
           provided action function against each node of the tree and
           accumulating the resulting value.
- tuple  : Returns a simple hierarchical list representation of the
           tree that simplifies validation/testing.
- walk   : Returns a sequence of Nodes that result from walking the
           tree in, pre, or post order.
- links  : Returns a sequence of pairs that represent all the parent
           to child links in the tree.
- DOT    : Returns string in DOT (graphviz) format that can be used
           generate an image of the tree.

When a BinaryTree derived (concrete) class is instantiated, it take
a comparison function which is used to instantiate new Nodes.

The concrete classes that are derived from BinaryType must provide an
insert and remove function. The may also provide concrete
implementations of min, max and search if they support those
operations.

### BST (bst.js)

BST is a Binary Search Tree class derived from the BinaryTree class
that provides concrete implementations of insert, remove, search, min,
max. These methods are basically implemented as described in CLRS
(Algorithms, Cormen et al). One notable difference in the
implementation is that BST uses sentinel NIL nodes rather than null
pointers. This provides consistency of implementation across all the
binary tree data structures.

Unit tests for BST are defined in `test_bst.js`.

### RBT (rbt.js)

RBT is a Red-Black Tree class derived from the BST that overrides the
implementation of the insert and remove methods (and re-uses search,
min, and max from BST). These methods are basically implemented as
described in CLRS.

Unit tests for RBT are defined in `test_rbt.js`.

### HeapTree (heaptree.js)

HeapTree is a Heap derived from the BinaryTree class. The HeapTree
class supports either min-heap or max-heap behavior that can be
selected at instantiation time. HeapTree provides concrete
implementation for min (for min-heap), max (for max-heap), insert and
remove.

HeapTree uses normal references to connect Nodes in the tree together.
Because HeapTree does not use an array layout in memory (see
HeapArray), the algorithm for finding the last position of the tree
(for inserts and deletes) is more complicated and uses an O(log N)
walk from the root (implemented in heapGetLast).

Unit tests for HeapTree are defined in `test_heap.js`.

### HeapArray (heaparray.js)

HeapArray is similar to (and derived from) HeapTree but rather than
linking Nodes together using standard references, the Nodes are
positioned in an array in memory such that the left child is 2i+1
(where i is the index of the current node). HeapArray overrides the
insert and remove methods but still uses the heapBubbleUp and
heapBubbleDown functions from HeapTree.

Unit tests for HeapArray are defined in `test_array.js`.

### Tasks (tasks.js)

Tasks for the scheduler to run can be generated dynamically or loaded
from a task description file. A task description file has the
following format:

```
NUM_OF_TASKS TOTAL_TIME
TASK1_ID TASK1_START_TIME TASK1_DURATION
TASK2_ID TASK2_START_TIME TASK2_DURATION
...
TASKn_ID TASKn_START_TIME TASKn_DURATION
```

The parseTasks function (in tasks.js) can be used to parse the data
from a task description file into a tasks descriptor object/map that
can be passed to the scheduler function.

The generateTasks function (in tasks.js) can be used to generate task
descriptor object/map. The function parameters allow for fixed or
random ranges for the start and durations of the tasks being
generated.

The tasksToString function (in tasks.js) takes a task descriptor
object/map and generates a string in the task description file format
which can then be written to disk as a task desctiption file.

### Driver programs / UI

TODO: describe Node install process

There are several programs that can be run directly from the command
line using Node.js. `node PROGRAM.js` will print out command line
usage string.

- `tasks.js`: file can be run directly to read and parse a tasks file
  or to write a new tasks file.

- `scheduler.js`: 

- `run_tasks.js`:

- `run_tasks_fairness.js`:

In addition there are two web interfaces:

- trees.html:
- scheduler.html:




- Hierarchy:

    binarytree.js :: BinaryTree
        L bst.js :: BST
            L rbt.js :: RBT
        L heaptree.js :: HeapTree
            L heaparray.js :: HeapArray
