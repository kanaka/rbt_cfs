bst = require('./bst');
rbt = require('./rbt');
heaptree = require('./heaptree');
heaparray = require('./heaparray');
sched = require('./scheduler');

// Generate n tasks that each start at time 1 and all run for duration
function generate_tasks (n, duration) {
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

// Using timeline for the timeline tree structure, generate a task
// queue for each of size 2^pow1 to 2^pow2 and do runScheduler and
// generate a report for each run.
function run_tasks (pow1, pow2, timeline) {
    for (var i=pow1; i<=pow2; i++) {
        var num_tasks = Math.pow(2,i);
        var tasks = generate_tasks(num_tasks, 10);

        // Run the CFS algorithm and generate a results report
        var results = sched.runScheduler(tasks, timeline);

        sched.generate_report(tasks, results);
        console.log("\n");
    }
}

function usage() {
    console.log("node run_tasks.js [bst|rbt|heaptree|heaparray] START_FACTOR END_FACTOR");
    process.exit(2);
}

if (process.argv.length < 5) {
    usage();
}

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

// Parse the start and end factors
var start_factor = parseInt(process.argv[3],10),
    end_factor = parseInt(process.argv[4],10);

// Run through the different task sizes using the specified timeline
// tree structure.
console.log("Running with:", mode);
run_tasks(start_factor, end_factor, timeline);
