(function() {
  'use strict';

var app = angular.module("setting.controller", []);

app.controller("SettingsCtrl", SettingsCtrl);

function SettingsCtrl($scope, settingService, StoreAppService) {
  var ctrl = this;
  ctrl.service = settingService;
  ctrl.update = update;
  ctrl.remove = remove;
  ctrl.edit = edit;
  ctrl.confirm = {};
  ctrl.addShortcut = addShortcut;
  ctrl.add = {'name': '', 'path':''};

  function update() {
    ctrl.service.updateDB();
  };

  function edit(k) {
    if (!ctrl.confirm[k.id]) ctrl.confirm[k.id]={};
    (ctrl.confirm[k.id]['edit']) ? put(k) : ctrl.confirm[k.id]['edit'] = true;
    console.log('edit -', ctrl.confirm[k.id]['edit']);
  }

  function put(k) {
    console.log('put', k);
    ctrl.service.putShortcut(k.id, k.name, k.path);
    ctrl.confirm[k.id]['edit'] = false
  }

  function remove(uid) {
    if (!ctrl.confirm[uid]) ctrl.confirm[uid]={};
    (ctrl.confirm[uid]['check']) ? _delShortcut(uid) : ctrl.confirm[uid]['check'] = true;
  };

  function _delShortcut(uid) {
    console.log('Delete shortcut',uid);
    ctrl.service.delShortcut(uid, true);
  };

  function addShortcut() {
    if (!ctrl.add.name || !ctrl.add.path) return;
    ctrl.service.postShortcut(ctrl.add.name, ctrl.add.path, true);
    ctrl.add = {'name': '', 'path': ''};
  }

}

})();
