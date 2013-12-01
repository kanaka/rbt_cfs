//#!/usr/bin/env node

// Node vs browser behavior
if (typeof module === 'undefined') {
    var tasks = {},
        exports = tasks;
}

// parseTasks: takes a string with the contents of a task file and
// parses it. Returns an object/hashmap containing num_of_tasks,
// total_time and task_queue.
function parseTasks (data) {
    var input=data.split('\n');
    var line1 = input[0].split(' ');
    // First line has num_of_tasks and total_time
    var num_of_tasks=parseInt(line1[0], 10);
    var total_time=parseInt(line1[1], 10);

    // read in the tasks
    var queue= [];

    for(var j=1; j <= num_of_tasks; j++) {
        var task_data=input[j].split(' ');
        // Create a new task object and add it to the queue
        var task = {id         :          task_data[0],
                    start_time : parseInt(task_data[1], 10),
                    duration   : parseInt(task_data[2], 10)};
        queue.push(task);
    }

    // Numeric sort the task queue by the start_time attribute
    function sort_function (a, b) {
        return a.start_time - b.start_time;
    }
    queue.sort(sort_function);

    return {num_of_tasks: num_of_tasks,
            total_time:   total_time,
            task_queue:   queue};
}

// generateTasks: generate n tasks that each start at time 1 and all
// run for duration
function generateTasks (n, duration) {
    var queue = [];
    for (var i=0; i<n; i++) {
        var task = {id: "t" + i,
                    start_time: 1,
                    duration: duration};
        queue.push(task);
    }
    return {num_of_tasks: n,
            total_time: n*duration+1,
            task_queue: queue};
}


if (typeof require !== 'undefined' && require.main === module) {
    // we are being run directly so load the file specified and print
    // the data from the file
    if (process.argv.length < 3) {
        console.log("readFile TASK_FILE");
        process.exit(2);
    }

    var fs = require('fs');
    var fileName = process.argv[2];
    var data = fs.readFileSync(fileName, 'utf8');
    var tasks = parseTasks(data);

    console.log("Number of Tasks:", tasks.num_of_tasks);
    console.log("Total Time:", tasks.total_time);
    console.log("Task Queue:");
    console.log(tasks.task_queue);
} else {
    // we are being required as a module so export the parseTasks
    // function
    exports.parseTasks = parseTasks;
    exports.generateTasks = generateTasks;
}
