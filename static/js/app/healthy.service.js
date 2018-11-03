(function() {
  'use strict';

var app = angular.module('healthy.service', ['ngResource',]);

app.service('healthyService', healthyService);

app.factory("healthStg", function($resource) {
  return $resource("api/health/:optPath", {optPath:'@path'});
});

function healthyService(healthStg, StoreAppService) {
  var self = this;

};

})();
