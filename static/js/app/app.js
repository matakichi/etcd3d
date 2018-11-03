'use strict';

//import config from './app.route.js';

const requires = [
//	'ngResource',
//	'ngRoute',
//	'ui.router',
	'djng.urls',
	'ui.bootstrap',
	'ngAnimate',
	'e3d.routes',
	'e3d.services',
	'e3d.controllers',
	'store.service',
	'store.controller',
	'setting.service',
	'setting.controller',
	'healthy.service',
	'healthy.controller',
	'graph.controller',
];

var app = angular.module('e3d.app', requires);
