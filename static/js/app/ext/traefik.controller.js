(function() {
  'use strict';

//var app = angular.module("modal.controller", ['ui.bootstrap', 'ngAnimate']);

//app.controller("modalCreateTraefik", modalCreateTraefik);

angular.module('e3d.app').controller('modalCreateTraefik', modalCreateTraefik);

function modalCreateTraefik($uibModalInstance, kvsMg, StoreAppService) {
  var self = this;

  const BACKEND_BASE_PATH = '/traefik/backends';
  const FRONTEND_BASE_PATH = '/traefik/frontends';

  self.backends = [{'server': '', 'url': '', 'weight': ''}], self.frontends = [{'backend': '', 'route': '', 'rule': ''}];
  self.backend_name = '', self.frontend_name = '';

  self.appendBackend = appendBackend;
  self.appendFrontend = appendFrontend;
  self.pullBackend = pullBackend;
  self.pullFrontend = pullFrontend;
  self.commit = commit;
  self.dismiss = dismiss;

  function appendBackend() {
    self.backends.push({'server': '', 'url': '', 'weight': ''});
  };

  function appendFrontend() {
    self.frontends.push({'backend': '', 'route': '', 'rule': ''});
  };

  function pullBackend(i) {
    self.backends.splice(i, 1);
  };

  function pullFrontend(i) {
    self.frontends.splice(i, 1);
  };

  function dismiss() {
    $uibModalInstance.dismiss();
  };

  function _create(key, value) {
    if (value) {
      kvsMg.put({key, value}).$promise.then(function(res) {
        console.log('put.success', res);
        StoreAppService.store('response', {key: res.key, func: 'put', status: 'success'})
      }, function(err) {
        console.log('put.error', err);
        StoreAppService.store('response', {key: err.key, func: 'put', status: 'error'})
      })
    } else {
      kvsMg.mk({actPath: 'directory'}, {key}).$promise.then(function(res) {
        console.log('mk.success', res);
        StoreAppService.store('response', {key: res.key, func: 'mkdir', status: 'success'});
      }, function(err) {
        console.log('mk.error', err);
        StoreAppService.store('response', {key: err.key, func: 'mkdir', status: 'error'});
      })
    }
  };

  function createBackend(b) {
    /*
       Create directory and values.
      `/traefik/backends/{backend_name}/servers/{server_name}/{values}`
    */
    console.log('Add new backend.', self.backend_name, b.server, b.url, b.weight);
    const _backend = BACKEND_BASE_PATH + '/' + self.backend_name;
    _create(_backend, null);
    _create(_backend + '/servers', null);
    _create(_backend +'/servers/' + b.server, null);
    _create(_backend +'/servers/' + b.server + '/url', b.url);
    _create(_backend +'/servers/' + b.server + '/weight', b.weight + '');
  };

  function createFrontend(f) {
    /*
       Create directory and values.
      `/traefik/frontends/{frontend_name}/backend {target}`
      `/traefik/frontends/{frontend_name}/routes/{route_name}/rule {rule}`
    */
    console.log('Add new frontend.', self.frontend_name, f.backend, f.route, f.rule);
    const _frontend = FRONTEND_BASE_PATH + '/' + self.frontend_name;
    _create(_frontend);
    _create(_frontend + '/backend', f.backend);
    _create(_frontend + '/routes', null);
    _create(_frontend + '/routes/' + f.route, null);
    _create(_frontend + '/routes/' + f.route + '/rule', f.rule);
  };

  function commit() {
    console.log(self.backends, self.frontends);

    for (var b of self.backends) {
      (self.backend_name && b.server && b.url && b.weight)?createBackend(b):null;
    };

    for (var f of self.frontends) {
      (self.frontend_name && f.backend && f.route && f.rule)?createFrontend(f):null;
    };

    $uibModalInstance.close();
  };

};

})();
