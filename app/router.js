'use strict';

define([
	'jquery', 'underscore', 'backbone'
], function($, _, Backbone,) {

	// Defining the application router
	var AppRouter = Backbone.Router.extend({

		routes: {
			''	: 'home'
		},

		home: function(){
			this.destroyExistingViews();
			this.createHeader();
			require(['home/view/HomeView'], function(HomeView) {
				currentView = new HomeView({
					container: $("#content-wrapper")
				});
			}, function(err) {
				console.log("error loading home page"+err);
			});
		},

		createHeader: function(){
			require([ 'headerContainer/view/HeaderContainerView' ], function(HeaderContainerView) {
				headerView = new HeaderContainerView({
					container: $('header')
				});
			}, function(err) {
				console.log("error loading header"+err);
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
