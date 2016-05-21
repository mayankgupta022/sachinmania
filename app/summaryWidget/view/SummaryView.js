'use strict';

define(
	[ 'jquery', 'underscore', 'backbone',
	'text!summaryWidget/template/SummaryTemplate.htm',
	'common/view/CommonView',
	'common/collection/CommonCollection',
	'summaryWidget/view/SummaryDataView'
], function($, _, Backbone, summaryTemplate, CommonView, SummaryCollection, SummaryDataView) {

	var SummaryView = CommonView.extend({

		initialize: function (options) {
			if(options) {
				this.options = options;

				if(typeof options.transformFunction == 'function'){
					this.transformFunction = options.transformFunction;
				}

				this.createSummaryData();
			}
		},

		createSummaryData: function () {
			this.widgetCollection = new SummaryCollection(this.options.data, this.options);
			if (this.options.url) {
				this.widgetCollection.on('sync', this.render, this);
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
			var summaryArray = this.transformFunction(this);
			this.widgetCollection.reset(summaryArray);

			var compiledTemplate = _.template(summaryTemplate);
			this.options.container.html(this.$el.html(compiledTemplate));

			this.renderCollectionData();

			return this;
		}

	});

	return SummaryView;
});
