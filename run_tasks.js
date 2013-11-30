#!/usr/bin/env node

bst = require('./bst');
rbt = require('./rbt');
heaptree = require('./heaptree');
heaparray = require('./heaparray');
tasks = require('./tasks');
sched = require('./scheduler');

// Using timeline for the timeline tree structure, generate a task
// queue for each of size 2^pow1 to 2^pow2 and do runScheduler and
// generate a report for each run.
function run_tasks (pow1, pow2, timeline) {
    for (var i=pow1; i<=pow2; i++) {
        var num_tasks = Math.pow(2,i);
        var taskdata = tasks.generateTasks(num_tasks, 1, 10);

        // Run the CFS algorithm and generate a results report
        var results = sched.runScheduler(taskdata, timeline);

        sched.generate_report(taskdata, results);
        console.log("\n");
    }
}

function usage() {
    console.log("node run_tasks.js [bst|rbt|heaptree|heaparray] START_FACTOR END_FACTOR");
    process.exit(2);
}

if (process.argv.length < 5) {
    usage();
}

function vsort(a,b) {
    return a.val.vruntime - b.val.vruntime;
}

// Pick the timeline tree structure based on the string given on the
// command line
var mode, Timeline;
switch (process.argv[2].toLowerCase()) {
    case 'bst':
        mode="BST";
        timeline = new bst.BST(vsort);
        break;
    case 'rbt':
        mode="RBT";
        timeline = new rbt.RBT(vsort);
        break;
    case 'heaptree':
        mode="HeapTree";
        timeline = new heaptree.HeapTree('min', vsort);
        break;
    case 'heaparray':
        mode="HeapArray";
        timeline = new heaparray.HeapArray('min', vsort);
        break;
    default:
        usage();
}

// Parse the start and end factors
var start_factor = parseInt(process.argv[3],10),
    end_factor = parseInt(process.argv[4],10);

// Run through the different task sizes using the specified timeline
// tree structure.
console.log("Running with:", mode);
run_tasks(start_factor, end_factor, timeline);
