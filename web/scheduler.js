if (!window.FileReader) {
    throw new Error("Browser missing FileReader API");
}

var $ = function(s) { return document.querySelector(s); };

window.onload = function () {
    //Check File API support
    var timeline;

    $("#fileInput").addEventListener('change', function (e) {
        var file = e.target.files[0]; //File object
            fReader = new FileReader();

        if (file) {
            fReader.addEventListener("load", function (event) {
                $("#rawTasksFile").innerHTML = event.target.result;
            });
            //Read the text file
            fReader.readAsText(file);
            console.log("Loaded " + file.name);
        }
    });

    $("#runButton").addEventListener('click', function () {
        try {
            var rawTasksString = $("#rawTasksFile").innerHTML;
            var tasksData = tasks.parseTasks(rawTasksString);
        } catch (e) {
            console.error(e.stack);
            alert("Error parsing task data: " + e);
            throw e;
        }

        // Run the CFS algorithm and generate a results report
        var timeline = getTimelineByName($("#treeType").value);
        var results = scheduler.runScheduler(tasksData, timeline);

        var sR = $("#schedulerResults"),
            tT = $("#treeType"),
            detailed = $("#detailed").checked;
        sR.innerHTML += "Running scheduler with: " + timeline.name + "\n";
        sR.innerHTML += scheduler.generateReport(tasksData, results, detailed);
        sR.innerHTML += "\n";
    });

}
