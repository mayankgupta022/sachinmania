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
			require(['dashboard/view/DashboardView'], function(DashboardView) {
				currentView = new DashboardView({
					container: $("#content-wrapper")
				});
			}, function(err) {
				console.log("error loading home page"+err);
			});
		},

		destroyExistingViews: function(){
			//empty existing divs
			$("#content-wrapper").empty();

			if(currentView) {
				if(typeof currentView.destroyView === "function")
                    currentView.destroyView();
			}

		}
	});

	return AppRouter;
});
