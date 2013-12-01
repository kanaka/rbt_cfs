if (typeof module !== 'undefined') {
    var fs = require('fs');
    var binarytree = require('./binarytree'),
        rbt = require('./rbt'),
    tasksModule = require('./tasks'),
//        parse = require('./parsetasks'),
        scheduler = require('./scheduler');
}

window.onload = function () {
    var textFile;
    var file;
    var displayArea;
    var fileName;
    var picReader;
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("fileInput");
        displayArea = document.getElementById("schedulerOutput");

        fileInput.addEventListener('change', function (e) {
            file = filesInput.files[0]; //File object

            if (file) {
                picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
                    textFile = event.target;
                    displayArea.innerText = textFile.result;
                });
                //Read the text file
                picReader.readAsText(file);

            }
        });
    }
    else {
        console.log("Your browser does not support File API");
    }
    var dataStructure = document.getElementById("dataStructure");
    var runCall = document.getElementById("runButton");
    runCall.addEventListener('click', function () {
        if (textFile) {
            //fileName = picReader;
            var data = fs.readFileSync(file.name, 'utf8');
            var selectedDataStructure = dataStructure.options[dataStructure.selectedIndex].text;
            alert("calling with " + selectedDataStructure + " " + file.name);
            var tasks = tasksModule.parseTasks(data);

            var timeline = new rbt.RBT(function (a, b) {
                return a.val.vruntime - b.val.vruntime;
            });

            // Run the CFS algorithm and generate a results report
            var results = scheduler.runScheduler(tasks, timeline);

            scheduler.generate_report(tasks, results);
        }

        else
            displayArea.innerText = "      Select Input File to Run Scheduler"

    });

}





