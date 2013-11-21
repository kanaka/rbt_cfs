bst = require('./bst');
rbt = require('./rbt');
sched = require('./scheduler');

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

function run_tasks (pow1, pow2, timeline) {
    for (var i=pow1; i<=pow2; i++) {
        var num_tasks = Math.pow(2,i);
        var tasks = generate_tasks(num_tasks, 10);

        // Run the CFS algorithm and generate a results report
        var results = sched.runCFS(tasks, timeline);

        sched.generate_report(tasks, results);
        console.log("\n");
    }
}

var bst_timeline = new bst.BST(function (a, b) {
        return a.val.vruntime - b.val.vruntime; });
var rbt_timeline = new rbt.RBT(function (a, b) {
        return a.val.vruntime - b.val.vruntime; });

console.log("Running with BST:");
run_tasks(10, 10, bst_timeline);
console.log("Running with RBT:");
run_tasks(10, 10, rbt_timeline);
