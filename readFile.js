/**
 * Created by Kanthanarasimhaiah on 14/11/13.
 */
fs = require('fs');
rbt=require('./rbt.js');

var rbt= new rbt.RBT();
var curTime = 0
var min_vruntime = 0
var running_task = new Object(null);
running_task.vruntime=0;
running_task.truntime=0;
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
    var task_queue= [];
    var time_queue= [];
    var new_task=new Object();

    for(var j=1;j<input.length;j++){
        var timeDiffArray=input[j].split(' ');
        task_queue.push(timeDiffArray[1]);
    }

    time_queue=task_queue.sort();
    console.log(task_queue);
    console.log(time_queue);

    //process each task based on starting time of each task
    for(var i=0;i<total_time;i++)
    {
        while(time_queue && (time_queue[0]>=i))
        {
            new_task=time_queue.shift();
            new_task.vruntime=min_vruntime;
            rbt.insert(new_task);
        }
        if(running_task && (running_task.vruntime > min_vruntime))
        {
            rbt.insert(running_task);
            running_task = null;
        }

        if (running_task==null && rbt!=null)
        {
            running_task = redblackRemove();
            if (rbt!=null)
            {
                min_vruntime = rbt.min_vruntime
            }
        }
        if(running_task!=null)
        {
            running_task.vruntime++;
            running_task.truntime++;
            if (running_task.truntime >= running_task.duration)
                running_task = null;
        }

    }
});

