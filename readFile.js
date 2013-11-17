/**
 * Created by Kanthanarasimhaiah on 14/11/13.
 */
fs = require('fs');

var num_of_tasks;
var total_time;
var fileName = process.argv[2];

fs.readFile(fileName, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    //console.log(data);

    var input=data.split('\n');
    var line1 = input[0].split(' ');
    num_of_tasks=parseInt(line1[0], 10);
    total_time=parseInt(line1[1], 10);
    console.log("Numer of Tasks:", num_of_tasks);
    console.log("Total Time:", total_time);

    // read in the tasks
    var queue= [];

    for(var j=1;j<num_of_tasks;j++) {
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
    console.log("Tasks:");
    console.log(queue);
});

