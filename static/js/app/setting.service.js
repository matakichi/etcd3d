(function() {
  'use strict';

var app = angular.module('setting.service', ['ngResource',]);

app.service('settingService', settingService);

app.factory("kvsStg", function($resource) {
  return $resource("api/settings/:uid/:actPath", {actPath:'@path', uid: null}, {
    del: {
      method: 'DELETE',
      headers : {
        'Content-Type' : 'application/json'
      },
    },
    put: {
      method: 'PUT', hasBody: true,
      headers : {
        'Content-Type' : 'application/json'
      },
    },
    post: {
      method: 'POST', hasBody: true,
      headers : {
        'Content-Type' : 'application/json'
      },
    },
  });
});

function settingService(kvsStg, StoreAppService) {
  var self = this;

  self.settings = {}

  this.updateDB = function() {
    kvsStg.get(function(data) {
      console.log('kvsStg.query', data);
	  self.settings['shortcut'] = data['shortcut'];
	}, function(err) {
	  console.error("Error occured: ", err);
	});
  };

  this.postShortcut = function(name, path, update=false) {
    var data = {name, path}
    kvsStg.post({actPath: 'shortcut'}, data).$promise.then(function(res) {
      console.log('post.success', res);
      if (update) self.updateDB();
    }, function(err) {
      console.log('post.error', err);
    });
  };

  this.putShortcut = function(id, name, path, update=false) {
    var data = {name, path}
    kvsStg.put({actPath: 'shortcut', uid: id}, data).$promise.then(function(res) {
      console.log('put.success', res);
      if (update) self.updateDB();
    }, function(err) {
      console.log('put.error', err);
    });
  };

  this.delShortcut = function(key, update=false) {
    kvsStg.del({actPath: 'shortcut', uid: key}).$promise.then(function(res) {
      console.log('del.success', res);
      if (update) self.updateDB();
    }, function(err) {
      if (err.status === 404) {
        console.log('del.success'); if (update) self.updateDB();
      } else {
        console.log('del.error', err);
      }
    });
  };

  this.updateDB();
};

})();
