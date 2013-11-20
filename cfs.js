#!/usr/bin/env node
/**
 * Created by Kanthanarasimhaiah on 14/11/13.
 */

var rbt = require('./rbt.js');

// Run CFS algorithm

function runCFS(tasks, Tree) {
    if (!Tree) {
        Tree = rbt.RBT;
    }

    var time_queue = tasks.task_queue;
    var time_queue_idx = 0;

    var timeline = new Tree(function (a, b) {
        return a.val.vruntime - b.val.vruntime; });
    var min_vruntime = 0
    var running_task = null;

    // process each task based on starting time of each task
    for(var curTime=0; curTime < tasks.total_time; curTime++) {
        while(time_queue_idx < time_queue.length &&
              (curTime >= time_queue[time_queue_idx].start_time)) {
            var new_task = time_queue[time_queue_idx++];
            new_task.vruntime = min_vruntime;
            new_task.truntime = 0;
            timeline.insert(new_task);
        }
        if(running_task && (running_task.vruntime > min_vruntime)) {
            timeline.insert(running_task);
            running_task = null;
        }

        if (!running_task && timeline.size() > 0) {
            var min_node = timeline.min();
            running_task = min_node.val;
            timeline.remove(min_node);
            if (timeline.size() > 0) {
                min_vruntime = timeline.min().val.vruntime
            }
        }
        if (running_task) {
            running_task.vruntime++;
            running_task.truntime++;
            console.log(curTime + ": " + running_task.id);
            if (running_task.truntime >= running_task.duration) {
                console.log("Completed task:", running_task.id);
                running_task = null;
            }
        }
    }
}

if (require.main === module) {
    if (process.argv.length < 3) {
        console.log("cfs TASK_FILE");
        process.exit(2);
    }

    var readTasksModule = require('./readTasks');
    var fileName = process.argv[2];
    var tasks = readTasksModule.readTasks(fileName);

    console.log("Numer of Tasks:", tasks.num_of_tasks);
    console.log("Total Time:", tasks.total_time);
    console.log("Task Queue:");
    console.log(tasks.task_queue);

    runCFS(tasks, rbt.RBT);
} else {
    exports.runCFS = runCFS;
}

