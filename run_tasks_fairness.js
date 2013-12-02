#!/usr/bin/env node

bst = require('./bst');
rbt = require('./rbt');
heaptree = require('./heaptree');
heaparray = require('./heaparray');
sched = require('./scheduler');

var fs = require('fs');
var tasksModule = require('./tasks');

function usage() {
    console.log("node fairness.js [bst|rbt|heaptree|heaparray] TASK_FILE");
    process.exit(2);
}

if (process.argv.length < 4) {
    usage();
}


var fileName = process.argv[3];
var data = fs.readFileSync(fileName, 'utf8');
var tasks = tasksModule.parseTasks(data);

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

// Run the CFS algorithm and generate a results report
var header = "time,num_tasks,running_task_id,completed"
for (var j=0; j < tasks.task_queue.length; j++) {
    var task = tasks.task_queue[j];
    header += "," + task.id + "_t";
    header += "," + task.id + "_f";
    task.num_tasks_history = [];
}
console.log(header);

sched.runScheduler(tasks, timeline, function(curTime, results) {
    var t = results.time_data[curTime],
        res = [curTime, t.num_tasks]
    if (t.running_task) {
        res.push("\"" + t.running_task.id + "\"");
    } else {
        res.push("\"\"");
    }
    if (t.completed_task) {
        res.push(true);
    } else {
        res.push(false);
    }
    for (var j=0; j < tasks.task_queue.length; j++) {
        var task = tasks.task_queue[j];
        if (task.actual_start_time && task.hide !== true) {
            task.num_tasks_history.push(t.num_tasks);
            var tasks_sum = task.num_tasks_history.reduce(function(a,b) {
                return a+b; }),
                tasks_avg = tasks_sum/task.num_tasks_history.length,
                elapsed = (curTime-task.actual_start_time+1);
            if (task.truntime >= task.duration) {
                task.hide = true;
            }
            res.push(" " + task.truntime);
            //console.log(task.num_tasks_history);
            //console.log("Task " + task.id + " ratio of " + tasks_avg + " avg tasks: " +
            //(1.0/tasks_avg) + ", ratio of " + elapsed + " time: " + task.truntime/elapsed);
            var fairness = (task.truntime/elapsed)/(1.0/tasks_avg);
            res.push(fairness.toFixed(2));
        } else {
            res.push(" ");
            res.push("");
        }
    }
    console.log(res.join(","));
});

//sched.generateReport(tasks, results, true);

