(function() {
  'use strict';

var app = angular.module("graph.controller", ['ui.bootstrap', 'ui.bootstrap.tpls']);

app.controller("GraphTreeCtrl", GraphTreeCtrl);

function GraphTreeCtrl() {
/******Data Format******
treeData =
{
  "name": "/",
  "children": [
    {
      "name": "/test",
      "children": [
        {
          "name": "/test/dir1",
          "children": [
            {
              "name": "/test/dir1/test1"
            }
          ]
        },
        {
          "name": "/test/dir2"
        }
      ]
    }
  ]
}
*************/

  var ctrl = this;
  this.treeBuild = treeBuild;
  this.expandAll = expandAll;
  this.collapseAll = collapseAll;
  this.copyClipBoard = copyClipBoard;
  this.refreshing = false; // TODO: update refresh status.

  this.current_path = '/';


  function copyClipBoard() {
    console.log('copy - not implemented.... X(');
  }

  var duration = 400, root, svg;

  const margin = {top: 20, right: 90, bottom: 30, left: 90},
  width = document.querySelectorAll("#graph-container .treeMap")[0].clientWidth - margin.left - margin.right,
  height = document.querySelectorAll("#graph-container .treeMap")[0].clientHeight - margin.top - margin.bottom;

  var treemap = d3.tree().size([width, height]);

  function collapse(d) {
    if(d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function expand(d) {
    var children = (d.children)?d.children:d._children;
    if (d._children) {
        d.children = d._children;
        d._children = null;
    };
    if (children) children.forEach(expand);
  }

  function expandAll() {
    console.log('expandAll - called');
    expand(root);
    update(root);
  }

  function collapseAll() {
    console.log('collapseAll - called');
    if (!root.children) return;
    root.children.forEach(collapse);
    collapse(root);
    update(root);
  }

  function update(src) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    var i = 0;

    nodes.forEach(function(d) { d.y = d.depth * 40});

    // ---------------------- Nodes section ----------------------

    var node = svg.selectAll('g.node')
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

/*
     node.append('text')
        .attr('font-family', 'Font Awesome 5 Free')
        .attr('font-size', function(d) { return d.size+'em'} )
        .text(function(d) { return '\uf118' });
*/

    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
          return "translate(" + src.x0 + "," + src.y0 + ")";
      })
      .on('click', click)
      .on("mouseover", function(d) {
        // Show the information on mouse over.
        var g = d3.select(this);
        var filter = g.append("filter")
            .classed('info', true)
            .attr("id", "drop-shadow")
            .attr("height", "120%");

        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)
            .attr("result", "blur");

        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)
            .attr("dy", 5)
            .attr("result", "offsetBlur");

        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        var rect = g.append('rect')
            .classed("info", true)
            .attr('rx', 5)
            .attr('x', 28)
            .attr('y', 27)
            .attr('fill-opacity', 0.98)
            .style('fill', 'white')
            .attr("text-anchor", "middle")
            .style("filter", "url(#drop-shadow)");

        var info = g.append('text')
            .classed("info", true)
            .attr('x', 35)
            .attr('y', 48)
            .attr('fill', 'black')
            .text((d.data.is_dir) ? 'Is Directory' : d.data.value);

        var txtBox = info.node().getBBox();

        rect.attr('width', txtBox.width * 1.2)
            .attr('height', txtBox.height * 1.5);

      })
      .on("mouseout", function() {
          // Remove the information on mouse out.
          d3.select(this).select('text.info').remove();
          d3.select(this).select('rect.info').remove();
          d3.select(this).select('filter.info').remove();
      });

    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', '1e-6')
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "aliceblue"; });

    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) { var n = d.data.name.split("/"); return (n.length > 2) ? n.lastet() : d.data.name; });

    var nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
       });

    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "aliceblue";
      })
      .attr('cursor', 'pointer');


    // Remove any children nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + src.x + "," + src.y + ")";
        })
        .remove();

    nodeExit.select('circle').attr('r', '1e-6');

    nodeExit.select('text').style('fill-opacity', '1e-6');

    // ---------------------- links section ----------------------

    var link = svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d) {
          var o = {x: src.y0, y: src.x0};
          return diagonal(o, o);
        });

    var linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d) { return diagonal(d, d.parent) });

    // Remove any children links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
          var o = {x: src.y, y: src.x};
          return diagonal(o, o);
        })
        .remove();

    nodes.forEach(function(d) {
      d.y0 = d.y;
      d.x0 = d.x;
    });

    function diagonal(s, d) {
      return `M ${s.x} ${s.y}
              C ${(s.x + d.x) / 2} ${s.y},
              ${(s.x + d.x) / 2} ${d.y},
              ${d.x} ${d.y}`;
    }

    // Toggle children on click.
    function click(d) {
      console.log('click.path:', d.data.name);
      console.log('before:', ctrl.current_path);
      ctrl.current_path = d.data.name;
      if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
      update(d);
    }
  } // update

  function treeBuild() {

    Array.prototype.lastet = function () { return this[this.length -1];}

    console.log(document.querySelector("#graph-container .treeMap").offsetWidth, document.querySelector("#graph-container .treeMap").offsetHeight);

    d3.select("#graph-container .treeMap").select('svg').remove();

    svg = d3.select("#graph-container .treeMap").append('svg')
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

    // ---------- Handler zoom -------------
    var zoomed = function() {
      svg.attr("transform", d3.event.transform);
    }

    svg.call(d3.zoom().scaleExtent([0.75, 100, 10]).on("zoom", zoomed));

    d3.json("api/kvs/dir2json", function(error, treeData) {
      if (error) throw error;
      console.log('new data');

      root = d3.hierarchy(treeData, function(d) { return d.children; });
      root.y0 = height / 2;
      root.x0 = 0;

      // Collapse after the second level
      if (root.children) root.children.forEach(collapse);

      update(root);
    }); // json-section
  }
  this.treeBuild();
  }
})();
