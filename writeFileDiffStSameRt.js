var fs = require('fs');
var writeFileName= process.argv[2];
var no_of_tasks=parseInt(process.argv[3]);
var total_time=parseInt(process.argv[4]);
var run_time=parseInt(process.argv[5]);

var stream=fs.createWriteStream(writeFileName);
fs.writeFile(writeFileName, no_of_tasks );
stream.once('open',function (fd){
    stream.write("  "+ total_time);
    for(var i= 0; i < no_of_tasks;i++)
    {
        stream.write("\n"+"A"+i+" 1 "+run_time);
        stream.write("\n"+"A"+i+" "+ Math.floor(Math.random()*(total_time -1)+1)+" "+run_time);
    }
    stream.end();
});
