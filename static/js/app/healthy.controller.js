(function() {
  'use strict';

var app = angular.module("healthy.controller", []);

app.controller("HealthyCtrl", HealthyCtrl);

function HealthyCtrl(healthStg, healthyService, StoreAppService) {

  var ctrl = this;
  ctrl.service = healthyService;

  ctrl.refreshing = false;

  ctrl.healthy = ctrl.members = {};
  ctrl.alarm = [];

  this.updateDB = function() {
    healthStg.get(function(data) {
      console.log('healthStg.query', data);
	  ctrl.healthy['health'] = data;
	}, function(err) {
	  console.error("Error occured: ", err);
	});
    healthStg.query({optPath:'alarm'}, function(data) {
      console.log('healthStg.alarm.query', data);
      ctrl.alarm = data;
	}, function(err) {
	  console.error("Error occured: ", err);
	});
    healthStg.query({optPath:'members'}, function(data) {
      console.log('healthStg.members.query', data);
	  ctrl.healthy['members'] = data;
	  if (ctrl.healthy['health']) {
	    ctrl.members = {}
        angular.forEach(data, function(r, i) {
         if (ctrl.healthy.health.leader.name == r.name) {
           ctrl.members['name'] = r.name;
         } else {
           if (!('children' in ctrl.members)) {ctrl.members['children'] = []};
           ctrl.members.children.push({'name': r.name, 'peer_urls': r.peer_urls, 'client_urls': r.client_urls});
         }
         console.log('members', ctrl.members);
        });
	  }
      ctrl.refreshTree();
      ctrl.refreshing = false;
	}, function(err) {
	  console.error("Error occured: ", err);
	});
  };

  this.refresh = function() {
    this.refreshing = true;
    this.updateDB();
  }

  ctrl.refreshTree = function() {
    console.log('("#members.treeMap").clientWidth', document.querySelectorAll("#members.treeMap")[0].clientWidth);

    var margin = {top: 50, right: 10, bottom: 50, left: 10},
        width = document.querySelectorAll("#members.treeMap")[0].clientWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var treemap = d3.tree().size([width, height]),
        nodes = d3.hierarchy(ctrl.members);

    nodes = treemap(nodes);

    d3.select("#etcdTree").remove();

    var svg = d3.select("#members.treeMap").append("svg")
          .attr("id","etcdTree")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom),
        g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var link = g.selectAll(".link")
        .data( nodes.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
           return "M" + d.x + "," + d.y
             + "C" + d.x + "," + (d.y + d.parent.y) / 2
             + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
             + " " + d.parent.x + "," + d.parent.y;
           });

    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append('circle').attr("r", 6).attr('class', function(d){ return (d.children ? "leader": "leaf") });

    node.append("text")
      .attr("dy", ".2em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("color", "#F8F8FF")
      .text(function(d) { return (d.children) ? 'M' : '' });

    node.append("text")
      .attr("dy", ".4em")
      .attr("y", function(d) { return d.children ? -18 : 18; })
      .style("text-anchor", "middle")
      .text(function(d) { return (d.children) ? 'leader: ' + d.data.name : 'follower: ' + d.data.name; });
    }
  this.refresh();
  }
})();
