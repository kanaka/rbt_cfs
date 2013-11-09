var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;
    
var i = 0,
    duration = 750,
    rbt = new RBT(),
    root;

var tree = d3.layout.tree()
    .size([width, height])
    .children(function(n) {
        var c = [];
        if (n && n !== NIL) {
            if (n.left && n.left !== NIL) {
                c.push(n.left);
            }
            if (n.right && n.right !== NIL) {
                c.push(n.right);
            }
        }
        return c;
    })
    .sort(function(a, b) {
        return a.cmp(b);
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

function update() {
  root = rbt.root();

  root.x0 = height / 2;
  root.y0 = 0;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  //nodes.forEach(function(d) { d.y = d.depth * 180; });

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
      .text(function(d) { return d.val; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
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
}

rbt.insert(50,25,75,10,15);

update();
