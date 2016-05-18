requirejs.config({
	paths : {
		backbone : '../libs/backbone/backbone',
		bootstrap : '../libs/bootstrap/js/bootstrap',
		d3 : '../libs/nvd3/d3.v3.min',
		jquery : '../libs/backbone/jquery',
		nvd3 : '../libs/nvd3/nv.d3.min',
		text : '../libs/backbone/text',
		underscore : '../libs/backbone/underscore'
	},

	shim : {
		'underscore' : {
			exports : '_'
		},
		'backbone' : {
			deps : ['underscore', 'jquery', 'text'],
			exports : 'Backbone'
		},
		'bootstrap' : {
			deps : ['jquery'],
			exports : 'bootstrap'
		},
		'nvd3' : {
			deps : ['jquery', 'd3'],
			exports : 'nvd3'
		},
	},
	waitSeconds : 120
});

require([
	'jquery', 'bootstrap','nvd3','router'
], function($, bootstrap, nvd3, app_router) {

	var router = new app_router();
	Backbone.history.start();

});
