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

// Scheduler Fairness: ideal_truntime is the amount of truntime that
// a task should have at the current time unit/tick under ideal
// conditions (a perfectly subdividable CPU). The ideal_truntime is
// often fractional whereas the actual truntime is a whole number. For
// example, if there are two tasks, then after the first time
// unit/tick, each task will have an ideal_truntime of 0.5, whereas
// the actual truntime will be 1 for the task that actually ran and
// 0 for the task that did not run. After the next tick both tasks
// will have an ideal_truntime of 1 and both will also have an actual
// truntime of 1.

// Run the CFS algorithm and generate a results report
var header = "time,num_tasks,running_task_id,completed"
for (var j=0; j < tasks.task_queue.length; j++) {
    var task = tasks.task_queue[j];
    header += "," + task.id + "_t";
    header += "," + task.id + "_f";
    task.ideal_truntime = 0;
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
            if (task.truntime >= task.duration) {
                task.hide = true;
            }
            res.push(" " + task.truntime);
            // Calculate the fairness: ideal_truntime is the basically
            // the exact fractional ratio of the CPU time that this
            // task should have had at this point in time.
            task.ideal_truntime += 1.0/t.num_tasks;
            // The fairness is the ratio of actual truntime that this
            // task over the ideal_truntime for this task. A fairness
            // value of 1 means this task has actually run for the
            // a perfectly fair amount of truntime.
            var fairness = task.truntime/task.ideal_truntime;
            res.push(fairness.toFixed(2));
        } else {
            res.push(" ");
            res.push("");
        }
    }
    console.log(res.join(","));
});

//sched.generate_report(tasks, results, true);

