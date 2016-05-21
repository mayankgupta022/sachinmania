'use strict';

define([
	'jquery', 'underscore', 'backbone',
	'text!pieWidget/template/PieTemplate.htm',
	'common/view/CommonView',
	'common/collection/CommonCollection'
], function($, _, Backbone, pieTemplate, CommonView, PieCollection) {

	var PieView = CommonView.extend({

		initialize: function(options) {
			if(options) {
				this.options=options;

				if(typeof options.transformFunction == 'function')
					this.transformFunction = options.transformFunction;

				this.chartColors = ["#2e3192", "#c9a6ff", "#963d96", "#e589d4", "#f5b8e6", "#ACC4DD", "#749DC6", "#5185B8", "#8A8CC2", "#585AA8"];

				this.createPieChartData();
			}
		},

		createPieChartData: function(){
			this.widgetCollection = new PieCollection(this.options.data, this.options);
            if(this.options.url){
                this.widgetCollection.on('reset',this.render,this);
            } else {
                this.render();
            }
		},

		transformFunction: function(self) {
		},

		renderPieChart:function(){
			var self = this;
			var pieChartData = this.pieData;

			nv.addGraph(function() {
				var chart = nv.models.pieChart()
					.x(function(d) { return d.label })
					.y(function(d) { return d.value })
					.showLegend(self.options.showLegend)
					.color(self.chartColors)
					.showLabels(false)
					.donut(self.options.doughnut);

				var div = $('#pieChart svg', self.$el)[0];

				d3.select(div)
					.datum(pieChartData)
					.transition().duration(350)
					.call(chart);

				nv.utils.windowResize(chart.update);

				return chart;
			});
		},

		render: function() {
			this.pieData = this.transformFunction(this);

			var compiledTemplate = _.template(pieTemplate);
			this.options.container.html(this.$el.html(compiledTemplate));

			if(this.pieData && this.pieData.length != 0 ) {
				this.renderPieChart();
			} else {
				this.$('#pieChart').html("<div class='panel panel-danger error-message'><div class='panel-heading'>No Data Found</div></div>");
			}

			return this;
		}
	});

	return PieView;
});
