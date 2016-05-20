define([
    'jquery', 'underscore', 'backbone',
    'text!gridWidget/template/gridElementTemplate.htm',
    'common/view/CommonView',
    'common/collection/CommonCollection',
    'horizontalBarWidget/view/HorizontalBarView',
    'pieWidget/view/PieView',
	'summaryWidget/view/SummaryView'
], function($, _, Backbone, gridElementTemplate, CommonView, GridElementCollection, HorizontalBarView, PieView, SummaryView){

    var GridElementView = CommonView.extend({

        currentDisplayWidget: 'HorizontalBar',
        firstRender: true,

        initialize: function(options){
            if(options) {
                this.options=options;

                if(this.options.currentDisplayWidget) {
                    this.currentDisplayWidget = this.options.currentDisplayWidget;
                }

                if(typeof options.transformationFunction == 'function') {
                    this.transformationFunction = options.transformationFunction;
                }

                this.createGridElementData();
            }
        },

        createGridElementData: function(){
            this.gridElementCollection = new GridElementCollection(this.options.data, this.options);
            if(this.options.url) {
                this.gridElementCollection.on('reset',this.render,this);
            } else {
                this.render();
            }
        },

        render: function(){
            var data = {
                gridHeading: this.options.heading
            };

            var compiledTemplate = _.template(gridElementTemplate,data);

            if(this.options && this.options.container && this.firstRender) {
                this.options.container.html(this.$el.html(compiledTemplate));
                this.firstRender = false;
            } else {
                this.$el.html(compiledTemplate);
            }

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

    return GridElementView;
});
