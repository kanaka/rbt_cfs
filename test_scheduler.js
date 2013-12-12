// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_scheduler.js

"use strict";

var bst = require('./bst');
var rbt = require('./rbt');
var heaptree = require('./heaptree');
var heaparray = require('./heaparray');
var sched = require('./scheduler');
var tasksModule = require('./tasks');

function testScheduler(test, timeline) {
    var tasks = tasksModule.generateTasks(3,1,10);
    test.deepEqual(tasks.num_of_tasks, 3);

    var results = sched.runScheduler(tasks, timeline);

    var task_runs = {};
    var task_completes = {};
    // Build a map of completed tasks
    for (var i=0; i < tasks.task_queue.length; i++) {
        task_runs[tasks.task_queue[i].id] = 0;
        task_completes[tasks.task_queue[i].id] = false;
    }
    // Map of numbers of times each task ran
    for (var i=0; i < results.time_data.length; i++) {
        var tick = results.time_data[i];
        if (tick.running_task) {
            task_runs[tick.running_task.id] += 1;
        }
        if (tick.completed_task) {
            task_completes[tick.completed_task.id] = true;
        }
    }

    // Check that all tasks completed and ran for 10 ticks
    for (var t in task_runs) {
        test.deepEqual(task_runs[t], 10);
        test.deepEqual(task_completes[t], true);
    }

    test.done();
}

exports.testSchedulerBST = function(test) {
    var timeline = new bst.BST();
    testScheduler(test, timeline);
}

exports.testSchedulerRBT = function(test) {
    var timeline = new rbt.RBT();
    testScheduler(test, timeline);
}

exports.testSchedulerHeapTree = function(test) {
    var timeline = new heaptree.HeapTree('min');
    testScheduler(test, timeline);
}

exports.testSchedulerHeapArray = function(test) {
    var timeline = new heaparray.HeapArray('min');
    testScheduler(test, timeline);
}

