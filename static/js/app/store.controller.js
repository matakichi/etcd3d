(function() {
  'use strict';

var app = angular.module("store.controller", []);

app.controller("StoreKeysCtrl", StoreKeysCtrl);

app.filter('searchFor', function() {
  return function(arr, kwd) {
    if (!kwd) { return arr; };
    kwd = kwd.toLowerCase();
    return arr.map(function(o) { return (o.key.toLowerCase().indexOf(kwd) !== -1) ? o:null }).filter(Boolean);
  };
});

function StoreKeysCtrl($scope, kvsMg, kvsStg, storeService, settingService, StoreAppService) {
  var ctrl = this;
  ctrl.initial = initial;
  ctrl.findRoot = findRoot;
  ctrl.doSearch = doSearch;
  ctrl.selectKey = selectKey;
  ctrl.service = storeService;
  ctrl.isDir = isDir;
  ctrl.onFieldChange = onFieldChange;
  ctrl.submit = submit;
  ctrl.cancel = cancel;
  ctrl.remove = remove;

  ctrl._tags = settingService.settings

  ctrl.editKeyMode, ctrl.deletable = false;
  ctrl.submitMsg, ctrl.search = '';

  var kvs, shortcuts = [];

  function findRoot() {
    kvsMg.query({'root_only': 'true'}, function(data) {
      console.log('find: ', data)
      ctrl.kvs = data;
      console.log(data);
    }, function(err) {
      console.error("Error occured: ", err);
    });
  };

  function doSearch(key) {
    console.log('Search kwd', key);
    !key.length ? StoreAppService.notify('warn', 'Invalid keyword...'):
    kvsMg.query({key}, function(data) {
      console.log('Search', data);
      ctrl.kvs = data;
    }, function(err) {
      console.error("Error occured: ", err);
      StoreAppService.notify('warn', 'Error occured: ' + err.statusText);
    });
  };

  function selectKey(kv) {
    console.log('selectKey()', kv);
    if (kv.is_dir) {
      doSearch(kv.key);
    }
    this.service.select(kv);
  };

  function isDir() {
    return ctrl.service.currentKey && ctrl.service.currentKey.is_dir;
  }

  function onFieldChange() {
    this.deletable = false;
    if (!isDir()) {
      this.submitMsg = 'Update';
      this.editKeyMode = true;
    } else if (this.service.store.key && this.service.store.data) {
      this.submitMsg = 'Update';
      this.editKeyMode = true;
    } else if (this.service.store.key && !this.service.store.data) {
      this.submitMsg = 'Create DIR';
      this.editKeyMode = true;
    } else {
      this.submitMsg = 'Create DIR';
      this.editKeyMode = false;
    }
  };

  function _reset() {
    this.service.reset();
  };

  function remove() {
    console.log('remove()', this.service.store.key);
    if (this.deletable) {
        this.service.rmDirectory(this.service.currentKey.key);
        doSearch(this.service.currentKey.key);
        this.service.reset();
        this.deletable = false;
    } else {
        console.log('tash confirm..');
        this.deletable = true;
    }
    console.log(this.deletable);
  };

  function submit() {
    console.log('submit()');
    if (isDir() && !this.service.store.data) {
      console.log('Create New Directory', this.service.store.key);
      this.service.mkDirectory(this.service.store.key);
    } else {
      console.log('Updated with value', this.service.store.key, this.service.store.data);
      this.service.putKV(this.service.store.key, this.service.store.data)
    }
    //_reset();
    doSearch(this.service.currentKey.key);
    this.service.reset();
  };

  function cancel() {
    console.log('cancel()', this.service.store.key);
    this.service.reset();
  };

  StoreAppService.subscribe($scope, 'store', function(event, result) {
    console.log('storeCtrl.rest', event, result.args);
    var msg = '';
    if (result.args.status === 'success') {
      switch (result.args.func) {
        case 'mkdir':
          msg = 'Directory was created successfully at "' + result.args.key + '"';
//			    doSearch();
          break;
        case 'rm':
          msg = '"' + result.args.key + '" was deleted successfully.';
            doSearch('/');
          break;
        case 'put':
          msg = '"' + result.args.key + '" was updated successfully.';
//			    doSearch();
          break;
      }
      StoreAppService.notify('success', msg);
    }
    else {
	  StoreAppService.notify('danger', msg);
    };
  });

  ctrl.tag = function(k) {
    for (var i in ctrl._tags['shortcut']) {
      if (ctrl._tags['shortcut'][i]['path'] == k) {
      console.log('tag: ', k, ctrl._tags['shortcut'][i]['path']);
        return ctrl._tags['shortcut'][i].name;
      }
    }
    return "no-tag";
  }

  ctrl.currentKeyFil = function(l) {
    if (!(ctrl.service.currentKey)) return '';
    var k = ctrl.service.currentKey.key
    return k.length > l ? '...' + k.substring(k.length - l, k.length) : k;
   };

  function initial() {
    kvsStg.get(function(data) {
      console.log('kvsStg.get()', data);
      ctrl.shortcuts = data['shortcut'];
    }, function(err) {
      console.error("Error occured: ", err);
    });
    ctrl.findRoot();
  };
  initial();
}

})();
