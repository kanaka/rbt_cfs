// Node vs browser behavior
if (typeof module !== 'undefined') {
    var binarytree = require('./binarytree'),
        bst = require('./bst.js'),
        rbt = require('./rbt.js'),
        heaptree = require('./heaptree.js'),
        heaparray = require('./heaparray.js');
} else {
    var scheduler = {},
        exports = scheduler;
}

// runScheduler: Run scheduler algorithm
function runScheduler(tasks, timeline, callback) {
    // queue of tasks sorted in start_time order
    var time_queue = tasks.task_queue;
    // index into time_queue of the next nearest task to start
    var time_queue_idx = 0;

    // min_vruntime is set to the smallest vruntime of tasks on the
    // timeline
    var min_vruntime = 0;

    // current running task or null if no tasks are running.
    var running_task = null;


    // Initialize statistics gathering
    var results = {time_data: []};
    var start_ms = new Date().getTime();
    binarytree.RESET_STATS();

    // Loop from time/tick 0 through the total time/ticks specified
    for(var curTime=0; curTime < tasks.total_time; curTime++) {
        if (curTime % 1000 === 0) {
            console.error("curTime: " + curTime + ", size: " + timeline.size());
        }
    
        // Results data for this time unit/tick
        var tresults = {running_task: null,
                        completed_task: null};

        // Check tasks at the beginning of the task queue. Add any to
        // the timeline structure when the start_time for those tasks
        // has arrived.
        while (time_queue_idx < time_queue.length &&
               (curTime >= time_queue[time_queue_idx].start_time)) {
            var new_task = time_queue[time_queue_idx++];
            // new tasks get their vruntime set to the current
            // min_vruntime
            new_task.vruntime = min_vruntime;
            new_task.truntime = 0;
            new_task.actual_start_time = curTime;
            timeline.insert(new_task);
        }

        // If there is a task running and its vruntime exceeds
        // min_vruntime then add it back to the timeline. Since
        // vruntime is greater it won't change min_vruntime when it's
        // added back to the timeline.
        if (running_task && (running_task.vruntime > min_vruntime)) {
            timeline.insert(running_task);
            running_task = null;
        }

        // If there is no running task (which may happen right after
        // the running_task is added back to the timeline above), find
        // the task with the smallest vruntime on the timeline, remove
        // it and set it as the running_task and determine the new
        // min_vruntime.
        if (!running_task && timeline.size() > 0) {
            var min_node = timeline.min();
            running_task = min_node.val;
            timeline.remove(min_node);
            if (timeline.size() > 0) {
                min_vruntime = timeline.min().val.vruntime
            }
        }

        // Update the running_task (if any) by increasing the vruntime
        // and the truntime. If the running task has run for it's full
        // duration then report it as completed and set running_task
        // to null.
        var task_done = false;
        if (running_task) {
            running_task.vruntime++;
            running_task.truntime++;
            tresults.running_task = running_task;
            //console.log(curTime + ": " + running_task.id);
            if (running_task.truntime >= running_task.duration) {
                running_task.completed_time = curTime;
                tresults.completed_task = running_task
                task_done = true; // Set running_task to null later
                //console.log("Completed task:", running_task.id);
            }
        }

        tresults.num_tasks = timeline.size() + (running_task ? 1 : 0);

        results.time_data[curTime] = tresults;
        if (callback) {
            callback(curTime, results);
        }

        if (task_done) {
            running_task = null;
        }
    }

    // Put any currently running task back in the timeline
    if (running_task) {
        timeline.insert(running_task);
    }

    //binarytree.RESET_STATS();
    results.node_stats = binarytree.GET_STATS();
    results.elapsed_ms = (new Date().getTime())-start_ms;

    return results;
}

function generateSummary(tasks, timeline, results) {
    var out = "", tnodes = [], hvals = [];
    timeline.reduce(null, function (_, node) {
        var task = node.val;
        tnodes.push(task.id + ":" + task.vruntime +
                    (node.color ? "/" + node.color : ""));
    }, "in");

    for (var i=0; i < results.time_data.length; i++) {
        var t = results.time_data[i];
        hvals.push(t.running_task ? t.running_task.id : "_");
    }
    out += "Timeline: ";
    out += tnodes.join(",");
    out += "\nTask history: ";
    out += hvals.join(",");
    out += "\n";
    return out;
    
}

function generateReport(tasks, results, detailed) {
    var reads = 0, writes = 0, total = 0, completed = 0, out = "";

    // General info on the original tasks
    if (detailed) {
        out += "Task Queue:\n";
        for (var i=0; i < tasks.task_queue.length; i++) {
            var t = tasks.task_queue[i];
            out += t.id + " " + t.start_time + " " + t.duration + "\n";
            //console.log(tasks.task_queue);
        }
    }

    // A chronological summary of the state at each time
    if (detailed) {
        out += "\ntime [tasks]: running_task, completed?\n";
    }
    for (var i=0; i < results.time_data.length; i++) {
        var t = results.time_data[i],
            msg = "  " + i + " [" + t.num_tasks + "]: ";
        if (t.running_task) {
            msg += t.running_task.id;
        }
        if (t.completed_task) {
            msg += ", Completed";
            completed++;
        }
        if (detailed) {
            out += msg + "\n";
        }
    }

    // Sum all the reads and writes
    for (var r in results.node_stats.read) {
        reads += results.node_stats.read[r];
    }
    for (var r in results.node_stats.write) {
        writes += results.node_stats.write[r];
    }
    total = reads+writes;

    // Report summary statistics
    out += "Total Tasks: " + tasks.num_of_tasks + "\n";
    out += "Completed Tasks: " + completed + "\n";
    out += "Total Time: " + tasks.total_time + "\n";

    out += "Wallclock elapsed time: " + results.elapsed_ms + "ms\n";
    out += "Node operations reads  : " + reads + "\n";
    out += "                writes : " + writes + "\n";
    out += "                total  : " + total + "\n";
    out += "Throughput: " + (completed/results.elapsed_ms) + " completed tasks/ms\n";
    out += "            " + (completed/total) + " completed tasks/operation\n";
    //console.log("Tasks per tick:", tasks_per_tick);

    return out;
}

function getTimelineByName(name) {
    function vsort(a,b) {
            return a.val.vruntime - b.val.vruntime;
    }

    // Pick the timeline tree structure based on the string name
    var timeline;
    switch (name.toLowerCase()) {
    case 'bst':       timeline = new bst.BST(vsort); break;
    case 'rbt':       timeline = new rbt.RBT(vsort); break;
    case 'heaptree':  timeline = new heaptree.HeapTree('min', vsort); break;
    case 'heaparray': timeline = new heaparray.HeapArray('min', vsort); break;
    default:          throw new Error("Unknown timeline name '" + name + "'");
    }
    return timeline;
}

function usage() {
    console.log("node scheduler.js [--report|--detailed] bst|rbt|heaptree|heaparray TASK_FILE");
    process.exit(2);
}    

if (typeof require !== 'undefined' && require.main === module) {
    // we are being run directly so load the task file specified on
    // the command line pass the data to runScheduler using an
    // RedBlackTree for the timeline
    if (process.argv.length < 4) {
        usage();
    }

    var fs = require('fs');
    var tasksModule = require('./tasks');
    var report = false, detailed = false;

    switch (process.argv[2]) {
        case '--detailed':
            detailed = true; // fall through
        case '--report':
            report = true;
            process.argv.splice(2,1);
    }
    var timeline = getTimelineByName(process.argv[2]);
    var fileName = process.argv[3];
    var data = fs.readFileSync(fileName, 'utf8');
    var tasks = tasksModule.parseTasks(data);

    // Run the scheduler algorithm
    var results = runScheduler(tasks, timeline);

    // Print the summary information
    console.log(generateSummary(tasks, timeline, results));

    // Print a report from the results
    if (report || detailed) {
        console.log("Running with:", timeline.name);
        console.log(generateReport(tasks, results, detailed));
    }
} else {
    // we are being required as a module so export the runScheduler
    // function
    exports.runScheduler = runScheduler;
    exports.generateSummary = generateSummary;
    exports.generateReport = generateReport;
    exports.getTimelineByName = getTimelineByName;
}
