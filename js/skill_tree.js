
var svg = d3.select("#skill_tree");

var links = [];
var nodes = [];

console.log("Loading Data");
d3.json("data/skill_tree.json").then(function(data) {
  console.log("Parsing Data");
  var graphData = parse_graph(data);
  console.log("Drawing Graph");
  draw_graph();
});

function parse_graph(data) {
  // all links are child to parent
  var dataIndex = {};
  data.forEach(function(node, index) {
    dataIndex[node.id] = index;
  });

  var linkData = [];
  data.forEach(function(node) {
    node.parent.forEach(function(parentId) {
      var link = {
        "source": dataIndex[parentId],
        "target": dataIndex[node.id],
        "value": 1,
      }
      linkData.push(link);
    });
  });

  links = linkData;
  nodes = data;

  console.log(links);
  console.log(nodes);
}

function draw_graph() {
  var nodeLayout = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(svg.attr("width") / 2, svg.attr("height") / 2))
    .force('link', d3.forceLink().links(links))
    .on('tick', ticked);
}

function updateLinks() {
  // Select all current link lines, and merge with the data
  var u = d3.select('.links')
    .selectAll('line')
    .data(links);

  // Create any extras that are needed due to links updating
  u.enter().append('line').merge(u)
  // Then style them
    .attr('x1', function(d) { return d.source.x })
    .attr('y1', function(d) { return d.source.y })
    .attr('x2', function(d) { return d.target.x })
    .attr('y2', function(d) { return d.target.y })
    .attr("stroke-width", 1)
    .attr("stroke", "black");

  // Then remove any that arent actually needed anymore
  u.exit().remove();
}

function updateNodes() {
  u = d3.select('.nodes')
    .selectAll('text')
    .data(nodes)

  u.enter().append('text').merge(u)
    .text(function(d) { return d.text })
    .attr('x', function(d) { return d.x })
    .attr('y', function(d) { return d.y })
    .attr('dy', function(d) { return 5 })

  u.exit().remove()
}

function ticked() {
 updateLinks();
 updateNodes();
}
