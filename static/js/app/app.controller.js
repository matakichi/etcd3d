(function() {
  'use strict';

var app = angular.module("e3d.controllers", []);

app.controller("AppCtrl", StoreAppCtrl);

function StoreAppCtrl($scope, StoreAppService) {
  var vm = this;

  StoreAppService.subscribe($scope, 'notify', function(event, args) {
		console.log(event, args);
		if ('notify' == event.name) {
			switch (args.level) {
				case 'info':
					vm.alert.info(args.msg);
					break;
				case 'success':
					vm.alert.success(args.msg);
					break;
				case 'warning':
				case 'warn':
					vm.alert.warn(args.msg);
					break;
				case 'danger':
					vm.alert.danger(args.msg);
					break;
			}
		}
  });

  vm.alerts = [];

  const _words = {
    warn: '',
    danger: 'Oops! X( Check a few things up while try again later.',
    success: 'Done! Your action successfully.',
  };

	// bt.alert type: success, info, warning, danger
  vm.alert = {
      info: function(msg) {
        vm.alerts.push({type: 'info', msg});
      },
      success: function(msg) {
        vm.alerts.push({type: 'success', msg: msg || _words.success});
      },
      warn: function(msg) {
        vm.alerts.push({type: 'warning', msg: msg || _words.warn});
      },
      danger: function(msg) {
        vm.alerts.push({type: 'danger', msg: msg || _words.danger});
      }
   };

   StoreAppService.notify('info', 'S t a r t i n g . . . ;)   ......\\/\\/\\//\\/\\/\\/\\/\\/')

  vm.closeAlert = function(index) {
    console.log('closeAlert', index)
    vm.alerts.splice(index, 1);
  };
};
})();
