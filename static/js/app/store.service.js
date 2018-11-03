(function() {
  'use strict';

var app = angular.module('store.service', ['ngResource',]);

app.service("storeService", storeService);

app.factory("kvsMg", function($resource) {
  return $resource("api/kvs/:actPath", {actPath:'@path'}, {
    rm: {
      method: 'DELETE', hasBody: true,
      headers : {
        'Content-Type' : 'application/json'
      },
    },
    mk: {
      method: 'POST', hasBody: true,
      headers : {
        'Content-Type' : 'application/json'
      },
    },
    put: {
      method: 'POST', hasBody: true,
      headers : {
        'Content-Type' : 'application/json'
      },
    },
  });
});

function storeService(kvsMg, StoreAppService) {
  var self = this;
  self.store = {key: '', data: ''};
  self.currentKey = null;

  this.select = function(key) {
    console.log('service.select:', key);
    self.currentKey = key;
    self.store.data = !key.is_dir ? key.data:''
  };

  this.reset = function() {
    console.log('service.reset');
    self.store = {key: '', data: ''};
    self.currentKey = null;
  };

  this.mkDirectory = function(path) {
    var data = {key:  (this.currentKey.key === '/') ? '/' + path: this.currentKey.key + '/' + path}
    kvsMg.mk({actPath: 'directory'}, data).$promise.then(function(res) {
      console.log('mk.success', res);
      StoreAppService.store('response', {key: res.key, func: 'mkdir', status: 'success'});
    }, function(err) {
      console.log('mk.error', err);
      StoreAppService.store('response', {key: err.key, func: 'mkdir', status: 'error'});
    })
  };

  this.rmDirectory = function(key) {
    var data = {key}
    kvsMg.rm({actPath: 'directory'}, data).$promise.then(function(res) {
      console.log('rm.success', res);
      StoreAppService.store('response', {key: res.key, func: 'rm', status: 'success'});
    }, function(err) {
      console.log('rm.error', err);
      StoreAppService.store('response', {key: err.key, func: 'rm', status: 'error'});
    })
  };

  this.putKV = function(path, value) {
    var data = {key: path ? this.currentKey.key + '/' + path : this.currentKey.key , value}
    kvsMg.put(data).$promise.then(function(res) {
      console.log('put.success', res);
      StoreAppService.store('response', {key: res.key, func: 'put', status: 'success'})
    }, function(err) {
      console.log('put.error', err);
      StoreAppService.store('response', {key: err.key, func: 'put', status: 'error'})
    })
  };
};

})();
