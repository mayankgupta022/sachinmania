'use strict';

define([
	'jquery', 'underscore', 'backbone',
	'text!header/template/headerTemplate.htm',
	'common/view/CommonView'
], function($, _, Backbone, dashboardTemplate, CommonView){

	var HeaderView = CommonView.extend({

		initialize: function(options) {
			this.options = options;

			this.render();
		},

		render: function(){
			var compiledTemplate = _.template(dashboardTemplate);
			this.options.container.html(this.$el.html(compiledTemplate));

			return this;
		}

	});

	return HeaderView;
});
