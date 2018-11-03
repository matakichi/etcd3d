(function() {
  'use strict';
  angular.module('e3d.routes', ['ngRoute', 'ui.router', 'ui.bootstrap']).config(config).controller('NavCtrl', navCtrl);

  function navCtrl($location) {
    var nav = this;
    nav.active = function(page) {
      var currentRoute = $location.path().substring(1) || 'dashboard';
	    return page === currentRoute ? 'active' : '';
    }
  }

	function config($routeProvider, $stateProvider) {
		//TODO $stateProvider not working...
	  $routeProvider.
	    when('/dashboard', {
	      templateUrl: 'static/dashboard/home.html',
	    }).
	    when('/kvs', {
	      templateUrl: '/kvs',
	      controller: 'StoreKeysCtrl as ctrl'
	    }).
	    when('/healthy', {
	      templateUrl: '/healthy',
	      controller: 'HealthyCtrl as ctrl'
	    }).
	    when('/settings', {
	      templateUrl: '/settings',
	      controller: 'SettingsCtrl as ctrl'
	    }).
	    when('/graph', {
	      templateUrl: '/graph',
	      controller: 'GraphTreeCtrl as ctrl'
	    }).
	    when('/extensions', {
	      templateUrl: '/ext',
	      controller: 'extensionsService as ctrl'
	    }).
	    when('/admin', {
	      templateUrl: '/admin/',
	    }).
	    otherwise('/dashboard');

      $stateProvider
        .state('dashboard', {
          url: "/dashboard",
        })
        .state('healthy', {
          url: "/healthy",
        })
        .state('kvs', {
          url: "/kvs",
        })
        .state('graph', {
          url: "/graph",
        })
        .state('extensions', {
          url: "/extensions",
        })
        .state('settings', {
          url: "/settings",
        })
        .state('admin', {
          url: "/admin",
        });
/*
      $stateProvider
        .state('dashboard', {
          url: "/dashboard",
          views: {
            'container-view': {
               templateUrl: 'static/dashboard/home.html'
            },
          }
        })
        .state('store', {
          url: "/store",
          views: {
            'container-view': {
			        templateUrl: 'store'
           }
          }
        })
*/
  };
/*
        $urlRouterProvider.otherwise("/dashboard");
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                views: {
                    'container-view': {
                       templateUrl: 'static/dashboard/home.html'
                    },
                }
            })
            .state('store', {
                url: "/store",
                views: {
                    'container-view': {
							        templateUrl: 'store',
                    },
                    'left-view@store' :{
							        templateUrl: 'static/dashboard/store/show_lists.html',
							        controller: 'StoreKeysCtrl as ctrl'
                    },
                    'right-view@store' :{
								        templateUrl: 'static/dashboard/store/details.html',
								        controller: 'StoreKeysCtrl as ctrl'
                    },
                 },
            })
            }
*/
})();