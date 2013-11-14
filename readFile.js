/**
 * Created by Kanthanarasimhaiah on 14/11/13.
 */
fs = require('fs');

var num_of_tasks;
var total_time;

fs.readFile('/US_Univ/Fall2013/algo_project-clone/cse5311-project/data/simple3.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);

    var input=data.split('\n');
    num_of_tasks=input[0].substr(0,1);
    total_time=input[0].substr(2);
    console.log(num_of_tasks,total_time);//,task_one );

    //sort
//    input.forEach(function (){
//        //console.log("hi");
//        var array1=input[1].split(' ');
//        console.log(array1.sort());
//    });
    var timeArray='';
    for(var j=1;j<input.length;j++){
        //console.log(input.length);
        var timeDiffArray=input[j].split(' ');
        timeArray=timeArray.concat(timeDiffArray[2]);
        //console.log(timeArray.sort(function(a,b) {return a-b}));
        console.log(timeArray);
    }

    //process each task based on time of each task
    for(var i=0;i<total_time;i++)
    {
        //console.log(i);

    }
});

