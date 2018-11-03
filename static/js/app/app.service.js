(function() {
  'use strict';

var app = angular.module("e3d.services", []);

app.factory('StoreAppService', function($rootScope) {
  return {
    subscribe: function(scope, event, callback) {
      var handler = $rootScope.$on(event, callback);
      scope.$on('$destroy', handler);
    },
    notify: function(level, msg) {
        $rootScope.$emit('notify', {level, msg});
    },
    store: function(code, args) {
        $rootScope.$emit('store', {code, args});
    }
  };
});
})();
