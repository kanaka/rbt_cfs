#!/usr/bin/env node
/**
 * Created by Kanthanarasimhaiah on 14/11/13.
 */
fs = require('fs');

function readTasks (file) {
    var data = fs.readFileSync(file, 'utf8');

    var input=data.split('\n');
    var line1 = input[0].split(' ');
    var num_of_tasks=parseInt(line1[0], 10);
    var total_time=parseInt(line1[1], 10);

    // read in the tasks
    var queue= [];

    for(var j=1;j<=num_of_tasks;j++) {
        var task_data=input[j].split(' ');
        var task = {id         :          task_data[0],
                    start_time : parseInt(task_data[1], 10),
                    duration   : parseInt(task_data[2], 10)};
        queue.push(task);
    }

    function sort_function (a, b) {
        return a.start_time - b.start_time;
    }
    queue.sort(sort_function);
    return {num_of_tasks: num_of_tasks,
            total_time:   total_time,
            task_queue:   queue};
}

if (process.argv.length < 3) {
    console.log("readFile TASK_FILE");
    process.exit(2);
}

var fileName = process.argv[2];
var tasks = readTasks(fileName);

console.log("Numer of Tasks:", tasks.num_of_tasks);
console.log("Total Time:", tasks.total_time);
console.log("Task Queue:");
console.log(tasks.task_queue);


// Run CFS algorithm

var time_queue = tasks.task_queue;

var rbt =require('./rbt.js');
var timeline = new rbt.RBT(function (a, b) {
    return a.val.vruntime - b.val.vruntime; });
var min_vruntime = 0
var running_task = null;


// process each task based on starting time of each task
for(var i=0;i<tasks.total_time;i++)
{
    while(time_queue.length > 0 && (time_queue[0].start_time<=i))
    {
        var new_task=time_queue.shift();
        new_task.vruntime=min_vruntime;
        new_task.truntime=0;
        timeline.insert(new_task);
    }
    if(running_task && (running_task.vruntime > min_vruntime))
    {
        timeline.insert(running_task);
        running_task = null;
    }

    if (running_task==null && timeline.size() > 0)
    {
        var min_node = timeline.min();
        running_task = min_node.val;
        timeline.remove(min_node);
        if (timeline.size() > 0)
        {
            min_vruntime = timeline.min().val.vruntime
        }
    }
    if(running_task!=null)
    {
        running_task.vruntime++;
        running_task.truntime++;
        console.log(i + ": " + running_task.id);
        if (running_task.truntime >= running_task.duration) {
            console.log("Completed task:", running_task.id);
            running_task = null;
        }
    }
}
