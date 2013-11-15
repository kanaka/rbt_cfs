/**
 * Created by Kanthanarasimhaiah on 14/11/13.
 */
fs = require('fs');

var num_of_tasks;
var total_time;

fs.readFile('/US_Univ/Fall2013/algo_project-clone/cse5311-project/data/mixed6.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);

    var input=data.split('\n');
    num_of_tasks=input[0].substr(0,1);
    total_time=input[0].substr(2);
    console.log(num_of_tasks,total_time);//,task_one );

    //fetch starting time of all tasks and storing in timeArray
    var queue= [];
//    var testqueue=[];

    for(var j=1;j<input.length;j++){
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

