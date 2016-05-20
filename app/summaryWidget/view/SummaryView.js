'use strict';

define(
	[ 'jquery', 'underscore', 'backbone',
	'text!summaryWidget/template/SummaryTemplate.htm',
	'common/view/CommonView',
	'common/collection/CommonCollection',
	'summaryWidget/view/SummaryDataView'
], function($, _, Backbone, summaryTemplate, CommonView, SummaryCollection, SummaryDataView) {

	var SummaryView = CommonView.extend({
		firstRender: true,

		initialize: function (options) {
			if(options) {
				this.options = options;

				if(typeof options.transformFunction == 'function'){
					this.transformFunction = options.transformFunction;
				}

				this.widgetCollection= new SummaryCollection();

				this.createSummaryData();
			}
		},

		createSummaryData: function () {
			this.summaryData = new SummaryCollection(this.options.data, this.options);
			if (this.options.url) {
				this.summaryData.on('sync', this.render, this);
			} else if(this.options.data) {
				this.render();
			}
		},

		transformFunction: function(self) {
		},

		renderCollectionData: function() {
			if(this.widgetCollection){
				var listParent = this.$el.find('#summaryWidgetContainer');
				for (var i=0; i<this.widgetCollection.length; i++) {
					var summaryDataView = new SummaryDataView({
						data:this.widgetCollection.models[i]
					});
					listParent.append(summaryDataView.el);
				}
			}
		},

		render: function() {
			if(this.summaryData){
				var summaryArray = this.transformFunction(this);

				if(summaryArray)
					this.widgetCollection.reset(summaryArray);
			}

			var compiledTemplate = _.template(summaryTemplate);

			if(this.options && this.options.container && this.firstRender) {
				this.options.container.html(this.$el.html(compiledTemplate));
				this.firstRender = false;
			} else {
				this.$el.html(compiledTemplate);
			}

			this.renderCollectionData();

			return this;
		}

	});

	return SummaryView;
});
