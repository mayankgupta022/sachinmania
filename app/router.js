'use strict';

define([
	'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {

	var currentView = null;

	// Defining the application router
	var AppRouter = Backbone.Router.extend({

		routes: {
			''	: 'home'
		},

		home: function(){
			this.destroyExistingViews();
			this.createHeader();
			require(['dashboard/view/DashboardView'], function(DashboardView) {
				currentView = new DashboardView({
					container: $("#content-wrapper")
				});
			}, function(err) {
				console.log("error loading home page"+err);
			});
		},

		createHeader: function(){
			require(['header/view/HeaderView'], function(HeaderView) {
				currentView = new HeaderView({
					container: $("header")
				});
			}, function(err) {
				console.log("error loading header"+err);
			});
		},

		destroyExistingViews: function(){
			if(currentView) {
				if(typeof currentView.destroyView === "function")
                    currentView.destroyView();
			}

		}
	});

	return AppRouter;
});
