/**
 * Created by Kanthanarasimhaiah on 19/11/13.
 */

var fs = require('fs');
var writeFileName= process.argv[2];
var total_lines=parseInt(process.argv[3]);
var stream=fs.createWriteStream(writeFileName);
var j;
fs.writeFile(writeFileName,total_lines +" 500\n");
stream.once('open',function (fd){
//    stream.write(total_lines +" 500\n");
    for(var i= 1; i < total_lines+1;i++)
    {
        stream.write("A"+i+" "+Math.floor(Math.random()*(total_lines-1)+1)+" "+Math.floor(Math.random()*(total_lines-1)+1)+"\n");
    }
    stream.end();
});
