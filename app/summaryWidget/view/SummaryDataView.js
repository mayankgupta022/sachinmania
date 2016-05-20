'use strict';

define(
    [ 'jquery', 'underscore', 'backbone',
    'text!summaryWidget/template/SummaryDataTemplate.html',
    'common/view/CommonView'
], function($, _, Backbone, summaryDataTemplate, CommonView) {

    var SummaryDataView = CommonView.extend({
        firstRender: true,

        initialize: function(options) {
            this.options=options;
            if(this.options && this.options.data) {
                this.model = this.options.data;
            }

            this.render();
        },

        render: function() {
            var compiledTemplate = _.template(summaryDataTemplate,{
                summaryData:this.model,
                options:this.options
            });

            if(this.options && this.options.container && this.firstRender) {
                this.options.container.html(this.$el.html(compiledTemplate));
                this.firstRender = false;
            } else {
                this.$el.html(compiledTemplate);
            }

            return this;
        }

    });

    return SummaryDataView;
});
