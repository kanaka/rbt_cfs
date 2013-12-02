var $ = function(s) { return document.querySelector(s); };

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;
    
var i = 0,
    duration = 750,
    trees = {bst: new bst.BST(),
             rbt: new rbt.RBT(),
             minht: new heaptree.HeapTree('min'),
             maxht: new heaptree.HeapTree('max'),
             minha: new heaparray.HeapArray('min'),
             maxha: new heaparray.HeapArray('max')},
    curTree = trees['bst'],
    root;

var nilIdx = 0,
    tree = d3.layout.tree()
    .size([width, height])
    .children(function(n) {
        var c = [];
        if (n.val !== 'NIL') {
            if (n.left.val === 'NIL') {
                c.push({id: "NIL" + (nilIdx++), p: {}, val:'NIL'});
            } else {
                c.push(n.left);
            }
            if (n.right.val === 'NIL') {
                c.push({id: "NIL" + (nilIdx++), p: {}, val:'NIL'});
            } else {
                c.push(n.right);
            }
        }
        console.log(n.val, c);
        return c;
    })
    .sort(function(a, b) {
        if (a.val !== 'NIL' && b.val !== 'NIL') {
            return a.cmp(b);
        } else {
            return -1;
        }
    })

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.select(self.frameElement).style("height", "800px");

function nodeColor(n) {
    if (n.color === 'r') {
        return "red";;
    } else {
        return "dimgrey";;
    }
}

function update(sourceTree) {
  root = sourceTree.root();

  if (root === NIL) {
      root = {p: {}, val: 'NIL'};
  }

  root.x0 = height / 2;
  root.y0 = 0;

  // Don't update the read counts while scanning the tree
  RESET_STATS();

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id; });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.p.x + "," + d.p.y + ")"; });

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", nodeColor)
      .style("stroke", function(n) { return d3.rgb(nodeColor(n)).darker(); });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { if (d.val !== 'NIL') { return d.val; }})
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
      .attr("r", function(n) {
          if (n.val !== 'NIL') {
              return 4.5;
          } else {
              return 1.5;
          }
      })
      .style("fill", nodeColor)
      .style("stroke", function(n) { return d3.rgb(nodeColor(n)).darker(); });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.p.x + "," + d.p.y + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: d.source.x, y: d.source.y};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: d.source.x, y: d.source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Update the stats values
  var reads = 0, writes = 0;
  console.log(curTree.STATS);
  for (var r in curTree.STATS.read) {
    reads += curTree.STATS.read[r];
  }
  for (var r in curTree.STATS.write) {
    writes += curTree.STATS.write[r];
  }
  $('#stats_reads').innerText = reads;
  $('#stats_writes').innerText = writes;

  // Reset the stats to be the internal one for this tree
  RESET_STATS(curTree.STATS);
}

// Attach button/input handlers

$('#treeType').onclick = function() {
    console.log(this.value);
    curTree = trees[this.value];
    update(curTree);
}

$('#addOneButton').onclick = function() {
    var num = parseInt($('#addOneNumber').value, 10);
    RESET_STATS(curTree.STATS);
    curTree.insert(num);
    update(curTree);
}

$('#addXButton').onclick = function() {
    var cnt = parseInt($('#addXNumber').value, 10),
        min = parseInt($('#addXMin').value, 10),
        max = parseInt($('#addXMax').value, 10);
    for (var i=0; i < cnt; i++) {
        var num = parseInt(Math.random()*(max-min)+min, 10);
        RESET_STATS(curTree.STATS);
        curTree.insert(num);
    }
    update(curTree);
}

// Add a STATS structure to each tree

for (var t in trees) {
    RESET_STATS();
    trees[t].STATS = STATS;
}

update(curTree);
