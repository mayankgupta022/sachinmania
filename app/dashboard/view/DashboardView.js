'use strict';

define([
	'jquery', 'underscore', 'backbone',
	'text!dashboard/template/dashboardTemplate.htm',
	'common/view/CommonView',
	'common/collection/CommonCollection',
	'gridWidget/view/GridView'
], function($, _, Backbone, dashboardTemplate, CommonView, DashboardCollection, GridView){

	var DashboardView = CommonView.extend({

		initialize: function(options) {
			this.options = options;

			this.chartColors = ["#2e3192","#c9a6ff","#963d96","#e589d4","#f5b8e6","#ACC4DD","#749DC6","#5185B8","#8A8CC2","#585AA8"];

			this.dashboardCollection = new DashboardCollection(null, {url:"sachin.json"});
			this.dashboardCollection.on("sync", this.render,this);
		},

		scoreAgainstOppositionTransformation: function(self){
            var totalRuns=[];
			var averageRuns=[];

			var oppositionWise = self.widgetCollection.groupBy("opposition");

			for(var opposition in oppositionWise) {
				var total = _.reduce(oppositionWise[opposition], function(memo, num, i, obj) {
					if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
						return memo;
					return memo + num.attributes.batting_score;
				}, 0);
				var numberOfMatches = _.reduce(oppositionWise[opposition], function(memo, num, i, obj) {
					if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
						return memo;
					return memo + 1;
				}, 0);
				totalRuns.push({
					label: opposition,
					value: total
				});
				averageRuns.push({
					label: opposition,
					value: total/numberOfMatches
				});
			}

			averageRuns = _.sortBy(averageRuns, 'value').reverse();

			return [
				{key: 'Total Runs',values:totalRuns},
				{key: 'Average Runs',values:averageRuns}
			];
        },

		summaryTransformation: function(self) {
			var totalMatches = self.widgetCollection.models.length;

			var totalRuns = _.reduce(self.widgetCollection.models, function(memo, num, i, obj) {
				if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
					return memo;
				return memo + num.attributes.batting_score;
			}, 0);

			var totalWins = self.widgetCollection.where({match_result: "won"}).length;

			var totalCatches =  _.reduce(self.widgetCollection.models, function(memo, num, i, obj) {
				if(isNaN(num.attributes.catches))
				return memo;
				return memo + num.attributes.catches;
			}, 0);

			var summaryArray = [
			    {
			        elementName: "Total Matches",
			        elementValue: totalMatches
			    },{
			        elementName: "Total Score",
			        elementValue: totalRuns
			    },{
			        elementName: "Total Wins",
			        elementValue: totalWins
			    },{
			        elementName: "Total Catches",
			        elementValue: totalCatches
			    }
			];

			return summaryArray;
		},

		scoreInGroundTransformation: function(self) {
            var runs = [];

			var groundWise = self.widgetCollection.groupBy("ground");

			for(var ground in groundWise)			{
				runs.push({
					label: ground,
					value: _.reduce(groundWise[ground], function(memo, num, i, obj) {
						if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
							return memo;
						return memo + num.attributes.batting_score;
					}, 0)
				});
			}

			runs = _.sortBy(runs, 'value').reverse().slice(0,5);

			return runs;
        },

		centuriesTransformation: function(self) {
            var runs = [];

			var centuries = self.widgetCollection.groupBy(function(num, i, obj) {
				if(num.attributes.batting_score >= 200)
					return "Double Centuries";
				if(num.attributes.batting_score >= 100)
					return "Centuries";
				if(num.attributes.batting_score >= 50)
					return "Half Centuries";
				if(num.attributes.batting_score >= 30)
					return "Thirties";
				return "Others";
			});

			delete centuries["Others"];

			for(var score in centuries)			{
				runs.push({
					label: score,
					value: _.reduce(centuries[score], function(memo, num, i, obj) {
						if(num.attributes.batting_score == "DNB" || num.attributes.batting_score == "TDNB")
							return memo;
						return memo + 1;
					}, 0)
				});
			}

			runs = _.sortBy(runs, 'value').reverse().slice(0,5);

			return runs;
        },

		render: function() {
			var compiledTemplate = _.template(dashboardTemplate);
			this.options.container.html(this.$el.html(compiledTemplate));

			this.data = this.dashboardCollection.toJSON();

			this.summaryView = new GridView({
				container: $("#summaryContainer", this.$el),
				data: this.data,
				heading:"Summary",
				currentDisplayWidget: "Summary",
				transformationFunction : this.summaryTransformation
			});

			this.scoreAgainstOppositionView = new GridView({
				container: $("#scoreAgainstOpposition", this.$el),
				data:this.data,
				widgetID:"scoreAgainstOpposition",
				showLegend: true,
				heading:"Total and average runs against opposition",
				transformationFunction: this.scoreAgainstOppositionTransformation
			});

			this.scoreInGroundView = new GridView({
				container: $("#scoreInGround", this.$el),
				data:this.data,
				widgetID:"scoreInGround",
				currentDisplayWidget: "Pie",
				showLegend: true,
				heading:"Grounds with maximum runs",
				transformationFunction: this.scoreInGroundTransformation
			});

			this.centuriesView = new GridView({
				container: $("#centuries", this.$el),
				data:this.data,
				widgetID:"centuries",
				currentDisplayWidget: "Doughnut",
				showLegend: true,
				heading:"Centuries",
				transformationFunction: this.centuriesTransformation
			});

			return this;
		}

	});

	return DashboardView;
});
