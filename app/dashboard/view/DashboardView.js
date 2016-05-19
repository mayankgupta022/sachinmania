'use strict';

define([
	'jquery', 'underscore', 'backbone',
	'text!dashboard/template/dashboardTemplate.htm',
	'common/view/CommonView',
	'common/collection/CommonCollection',
	'gridWidget/view/GridElementView'
], function($, _, Backbone, dashboardTemplate, CommonView, DashboardCollection, GridElementView){

	var DashboardView = CommonView.extend({

		initialize: function(options) {
			this.options = options;

			this.chartColors = ["#2e3192","#c9a6ff","#963d96","#e589d4","#f5b8e6","#ACC4DD","#749DC6","#5185B8","#8A8CC2","#585AA8"];

			this.dashboardCollection = new DashboardCollection(null, {url:"sachin.json"});
			this.dashboardCollection.on("sync", this.render,this);
		},

		scoreAgainstOppositionTransformation: function(self){
            var runs=[];

			var oppositionWise = self.widgetCollection.groupBy("opposition");

			for(var opposition in oppositionWise) {
				runs.push({
					label: opposition,
					value: _.reduce(oppositionWise[opposition], function(memo, num, i, obj) {
						if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
							return memo;
						return memo + num.attributes.batting_score;
					}, 0)/_.reduce(oppositionWise[opposition], function(memo, num, i, obj) {
						if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
							return memo;
						return memo + 1;
					}, 0)
				});
			}

			runs = _.sortBy(runs, 'value').reverse();

			self.barChartData= [{key: 'Average Runs',values:runs }];
        },

		summaryTransformation: function(self) {
			var totalRuns = _.reduce(self.summaryData.models, function(memo, num, i, obj) {
				if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
					return memo;
				return memo + num.attributes.batting_score;
			}, 0);

			var summaryArray = [
			    {
			        elementName: "Total Matches",
			        elementValue: self.summaryData.models.length,
			        elementUnit: null
			    },{
			        elementName: "Total Score",
			        elementValue: totalRuns,
			        elementUnit: null
			    }
			];

			return summaryArray;
		},

		scoreInGroundTransformation: function(self) {
            var runs = [];

			var groundWise = self.widgetCollection.groupBy("ground");

			for(var ground in groundWise)			{
				runs.push({
					key: ground,
					y: _.reduce(groundWise[ground], function(memo, num, i, obj) {
						if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
							return memo;
						return memo + num.attributes.batting_score;
					}, 0)
				});
			}

			runs = _.sortBy(runs, 'value').reverse().slice(0,5);

			return runs;
        },

		render: function(){
			var compiledTemplate = _.template(dashboardTemplate);
			this.options.container.html(this.$el.html(compiledTemplate));

			this.data = this.dashboardCollection.toJSON();

			this.summaryCollectionView = new GridElementView({
				container: $("#summaryContainer", this.$el),
				data: this.data,
				heading:"Summary",
				currentDisplayWidget: "Summary",
				transformationFunction : this.summaryTransformation
			});

			this.horizontalBarView = new GridElementView({
				container: $("#scoreAgainstOpposition", this.$el),
				data:this.data,
				widgetID:"dashboardWidget",
				heading:"Average runs against opposition",
				transformationFunction: this.scoreAgainstOppositionTransformation
			});

			this.pieView = new GridElementView({
				container: $("#scoreInGround", this.$el),
				data:this.data,
				widgetID:"dashboardWidget",
				currentDisplayWidget: "Pie",
				heading:"Grounds with maximum runs",
				transformationFunction: this.scoreInGroundTransformation
			});

			return this;
		}

	});

	return DashboardView;
});
