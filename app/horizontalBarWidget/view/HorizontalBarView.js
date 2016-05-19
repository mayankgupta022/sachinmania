'use strict';

define(
    [ 'jquery', 'underscore', 'backbone',
    'text!horizontalBarWidget/template/HorizontalBarTemplate.htm',
    'common/view/CommonView',
    'common/collection/CommonCollection',
], function($, _, Backbone, horizontalBarTemplate, CommonView, HorizontalBarCollection) {

    var HorizontalBarView = CommonView.extend({
        firstRender             : true,

        initialize : function(options) {
            if(options) {
                this.options=options;

                this.chartColors = ["#2e3192","#c9a6ff","#963d96","#e589d4","#f5b8e6","#ACC4DD","#749DC6","#5185B8","#8A8CC2","#585AA8"];

                if(typeof options.transformFunction == 'function')
                    this.transformFunction = options.transformFunction;

                this.createHorizontalBarData();
            }

            $(window).bind("resize.app", _.bind(this.render, this)); //re-renders the widget on browser resize

        },

        createHorizontalBarData: function(){
            this.widgetCollection = new HorizontalBarCollection(this.options.data, this.options);
            if(this.options.url){
                this.widgetCollection.on('reset',this.render,this);
            } else {
                this.render();
            }
        },

        transformFunction: function(self) {
        },

        renderHorizontalBarGraph:function(){
            var horizontalBarData = this.barChartData;
            var self = this;

            var leftMargin = 100;
            var bottomMargin = 15;

            nv.addGraph(function() {
                var chart = nv.models.multiBarHorizontalChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .margin({top: 0, right: 30, bottom: bottomMargin, left: leftMargin})
                    .showValues(true)
                    .tooltips(true)
                    .showControls(false)
                    .showLegend(self.options.showLegend)
                    .color(self.chartColors)
                    .stacked(horizontalBarData.length > 1)
                    .showYAxis(true)
                    .showXAxis(true);

                chart.xAxis
                    .staggerLabels(true);

                    var XAxisLabel = "";
                    if(self.options.XAxisLabel)
                        XAxisLabel = self.options.XAxisLabel;
                    if(self.options.dataUnit)
                        XAxisLabel += " (" + self.options.dataUnit +")";

                chart.yAxis
                    .axisLabel(XAxisLabel)
                    .staggerLabels(true);

                var div = $('#horizontalBarChart svg', self.$el)[0];

                d3.select(div)
                    .datum(horizontalBarData)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });

        },

        render: function() {
            this.transformFunction(this);

            var compiledTemplate = _.template(horizontalBarTemplate);

            //if container is present, render in container
            if(this.options && this.options.container && this.firstRender){
                this.options.container.html(this.$el.html(compiledTemplate));
                this.firstRender = false;
            }else
                this.$el.html(compiledTemplate);

                if(this.options.size && this.options.size=="medium") {
                    $("#horizontalBarChart", this.$el).removeClass("custom-chart-large").addClass("custom-chart-medium");
                } else if(this.options.size && this.options.size=="large"){
                    $("#horizontalBarChart", this.$el).removeClass("custom-chart").addClass("custom-chart-large");
                } else if(this.options.size && this.options.size=="fluid"){
                    $("#horizontalBarChart", this.$el).removeClass("custom-chart").addClass("custom-chart-fluid");
                }

            if(this.widgetCollection && this.widgetCollection.length != 0 && this.barChartData.length != 0 ) {
                this.renderHorizontalBarGraph();
            }else{
                this.$('#horizontalBarChart').html("<div class='panel panel-danger error-message'><div class='panel-heading'>No Data Found</div></div>");
            }
            return this;
        },

        destroyView: function(){
            $(window).unbind("resize.app");
            this.undelegateEvents();
            this.remove();
            Backbone.View.prototype.remove.call(this);
        }
    });

    return HorizontalBarView;
});
