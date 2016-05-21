define([
    'jquery', 'underscore', 'backbone',
    'text!gridWidget/template/gridTemplate.htm',
    'common/view/CommonView',
    'horizontalBarWidget/view/HorizontalBarView',
    'pieWidget/view/PieView',
	'summaryWidget/view/SummaryView'
], function($, _, Backbone, gridTemplate, CommonView, HorizontalBarView, PieView, SummaryView){

    var GridView = CommonView.extend({

        currentDisplayWidget: 'HorizontalBar',

        initialize: function(options){
            if(options) {
                this.options=options;

                if(this.options.currentDisplayWidget) {
                    this.currentDisplayWidget = this.options.currentDisplayWidget;
                }

                if(typeof options.transformationFunction == 'function') {
                    this.transformationFunction = options.transformationFunction;
                }

                this.render();
            }
        },

        render: function(){
            var data = {
                gridHeading: this.options.heading
            };

            var compiledTemplate = _.template(gridTemplate,data);
            this.options.container.html(this.$el.html(compiledTemplate));

            this.renderSubmodules();

            return this;
        },

        renderSubmodules: function(){
            if(this.currentWidget) {
                this.currentWidget.destroyView();
            }
            switch(this.currentDisplayWidget) {
                case 'HorizontalBar':
                    this.createHorizontalBarWidget()
                    break;
                case "Pie":
                    this.createPieWidget()
                    break;
                case "Doughnut":
                    this.createPieWidget(true)
                    break;
                case 'Summary':
                    this.createSummaryWidget()
                    break;
            }
        },

        createHorizontalBarWidget: function(){
            this.currentWidget = new HorizontalBarView({
                container:$("#gridContainer", this.$el),
                data:this.options.data,
                widgetID:this.options.widgetID,
                showLegend: this.options.showLegend,
                parentRef: this,
                transformFunction: this.options.transformationFunction
            });
        },

        createPieWidget: function(doughnut){
            this.currentWidget = new PieView({
                container: $("#gridContainer", this.$el),
                data:this.options.data,
                widgetID: this.options.widgetID,
                doughnut: doughnut,
                showLegend: this.options.showLegend,
                parentRef: this,
                transformFunction: this.options.transformationFunction
			});
		},

        createSummaryWidget: function(){
            this.currentWidget = new SummaryView({
                container: $("#gridContainer", this.$el),
                data: this.options.data,
                widgetID: this.options.widgetID,
                parentRef: this,
                transformFunction: this.options.transformationFunction
            });
        },

        transformationFunction: function(self){
        }

    });

    return GridView;
});
