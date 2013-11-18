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

    for(var j=1; j <= num_of_tasks; j++) {
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

if (require.main === module) {
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
} else {
    exports.readTasks = readTasks;
}
