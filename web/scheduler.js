if (!window.FileReader) {
    throw new Error("Browser missing FileReader API");
}

var $ = function(s) { return document.querySelector(s); };

window.onload = function () {
    //Check File API support
    var timeline;

    function getTimeline(treetype) {
        function tsort(a, b) {
            return a.val.vruntime - b.val.vruntime;
        }

        var trees = {bst: new bst.BST(tsort),
                     rbt: new rbt.RBT(tsort),
                     minht: new heaptree.HeapTree('min', tsort),
                     minha: new heaparray.HeapArray('min', tsort)};
        return trees[treetype];
    }

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
        var timeline = getTimeline($("#treeType").value);
        var results = scheduler.runScheduler(tasksData, timeline);

        var sR = $("#schedulerResults"),
            tT = $("#treeType"),
            tName = tT.options[tT.selectedIndex].text,
            detailed = $("#detailed").checked;
        sR.innerHTML += "Running scheduler using " + tName + "\n";
        sR.innerHTML += scheduler.generateReport(tasksData, results, detailed);
        sR.innerHTML += "\n";
    });

}
