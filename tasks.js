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
function generateTasks (n, start, duration, start_max, duration_max) {
    if (typeof start_max === 'undefined') {
        start_max = start;
    }
    if (typeof duration_max === 'undefined') {
        duration_max = duration;
    }
    var queue = [], total_duration = 0;
    for (var i=0; i<n; i++) {
        var stime = Math.floor(Math.random()*(start_max-start+1)+start),
            dur = Math.floor(Math.random()*(duration_max-duration+1)+duration);
        total_duration += dur;
        var task = {id: "t" + (i+1),
                    start_time: stime,
                    duration: dur};
        queue.push(task);
    }
    return {num_of_tasks: n,
            total_time: total_duration+1,
            task_queue: queue};
}

function tasksToString(tasks) {
    var str = tasks.num_of_tasks + " " + tasks.total_time + "\n";
    for (var i=0; i < tasks.task_queue.length; i++) {
        var t = tasks.task_queue[i];
        str += t.id + " " + t.start_time + " " + t.duration + "\n";
    }
    return str;
}


if (typeof require !== 'undefined' && require.main === module) {
    function usage() {
        console.log("node tasks.js read TASK_FILE");
        console.log("node tasks.js write TASK_FILE tasks start duration [start_max [duration_max]]");
        process.exit(2);
    }
    // we are being run directly so load the file specified and print
    // the data from the file
    if (process.argv.length < 3) { usage(); }

    var fs = require('fs');
    var mode = process.argv[2].toLowerCase();
    var fileName = process.argv[3];

    switch (mode) {
    case 'read':
        var data = fs.readFileSync(fileName, 'utf8');
        var tasks = parseTasks(data);
        console.log(tasks);
        break;
    case 'write':
        var no_tasks = parseInt(process.argv[4],10),
            start = parseInt(process.argv[5],10),
            duration = parseInt(process.argv[6],10),
            start_max, duration_max;
        if (process.argv.length > 7) {
            start_max = parseInt(process.argv[7],10);
        }
        if (process.argv.length > 8) {
            duration_max = parseInt(process.argv[8],10);
        }
        var tstr = tasksToString(generateTasks(no_tasks,
                                               start,
                                               duration,
                                               start_max,
                                               duration_max));
        fs.writeFileSync(fileName, tstr);
        break;
    default:
        usage();
    }
} else {
    // we are being required as a module so export the parseTasks
    // function
    exports.parseTasks = parseTasks;
    exports.generateTasks = generateTasks;
    exports.tasksToString = tasksToString;
}
