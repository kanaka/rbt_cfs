var fs = require('fs');
var writeFileName= process.argv[2];
var no_of_tasks=parseInt(process.argv[3]);
var total_time=parseInt(process.argv[4]);

var stream=fs.createWriteStream(writeFileName);
fs.writeFile(writeFileName, no_of_tasks );
stream.once('open',function (fd){
    stream.write("  "+ total_time);
    for(var i= 0; i < no_of_tasks;i++)
    {
        stream.write("\n"+"A"+i+" 1 "+Math.floor(Math.random()*(no_of_tasks -1)+1));
    }
    stream.end();
});
