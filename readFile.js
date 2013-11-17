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
    console.log(data);

    var input=data.split('\n');
    var line1 = input[0].split(' ');
    num_of_tasks=parseInt(line1[0], 10);
    total_time=parseInt(line1[1], 10);
    console.log(num_of_tasks,total_time);//,task_one );

    //fetch starting time of all tasks and storing in timeArray
    var queue= [];
//    var testqueue=[];

    for(var j=1;j<num_of_tasks;j++){
        var timeDiffArray=input[j].split(' ');
        queue.push(timeDiffArray[1]);
//        testqueue.push(input[j]);
    }
    console.log(queue);
    console.log(queue.sort());

        //process each task based on starting time of each task
    for(var i=0;i<total_time;i++)
    {


    }
});

