// To run tests:
//     npm install nodeunit
//     node_modules/nodeunit/bin/nodeunit test_tasks.js

"use strict";

var rbt = require('./rbt');
var tasksModule = require('./tasks');
var fs = require('fs');

exports.testGenerateTasks = function(test) {
    var tasks = tasksModule.generateTasks(3,1,10);

    test.deepEqual(tasks.num_of_tasks, 3);
    test.deepEqual(tasks.total_time, 31);
    test.deepEqual(tasks.task_queue.length, 3);
    var tid_set = {};
    for (var i=0; i < tasks.task_queue.length; i++) {
        tid_set[tasks.task_queue[i].id] = true;
        test.deepEqual(tasks.task_queue[i].start_time, 1);
        test.deepEqual(tasks.task_queue[i].duration, 10);
    }
    // Make sure the set of task IDs contains 3 unique values (no dupes)
    test.deepEqual(Object.keys(tid_set).length,3);

    test.done();
}

exports.testReadTasks = function(test) {
    var data = fs.readFileSync('data/flat4.txt', 'utf8');
    var tasks = tasksModule.parseTasks(data);

    test.deepEqual(tasks.num_of_tasks, 4);
    test.deepEqual(tasks.total_time, 41);
    test.deepEqual(tasks.task_queue.length, 4);
    var tid_set = {};
    for (var i=0; i < tasks.task_queue.length; i++) {
        tid_set[tasks.task_queue[i].id] = true;
        test.deepEqual(tasks.task_queue[i].start_time, 1);
        test.deepEqual(tasks.task_queue[i].duration, 10);
    }
    // Make sure the set of task IDs contains 3 unique values (no dupes)
    test.deepEqual(Object.keys(tid_set).length,4);

    test.done();
}

