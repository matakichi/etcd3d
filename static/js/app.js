var app = angular.module("e3d.app", ['ui.bootstrap']);

app.controller('testAppController1', function(){
  this.message = "First App 1";

  this.hello = function(string) {
    alert('Hello ' + string);
  };

});