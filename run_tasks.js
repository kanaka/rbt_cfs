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

        console.log(sched.generateReport(taskdata, results));
        console.log("\n");
    }
}

function usage() {
    console.log("node run_tasks.js bst|rbt|heaptree|heaparray START_FACTOR END_FACTOR");
    process.exit(2);
}

if (process.argv.length < 5) {
    usage();
}

var timeline = sched.getTimelineByName(process.argv[2]);

// Parse the start and end factors
var start_factor = parseInt(process.argv[3],10),
    end_factor = parseInt(process.argv[4],10);

// Run through the different task sizes using the specified timeline
// tree structure.
console.log("Running with:", timeline.name);
run_tasks(start_factor, end_factor, timeline);
