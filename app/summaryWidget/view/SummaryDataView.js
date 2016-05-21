'use strict';

define(
    [ 'jquery', 'underscore', 'backbone',
    'text!summaryWidget/template/SummaryDataTemplate.html',
    'common/view/CommonView'
], function($, _, Backbone, summaryDataTemplate, CommonView) {

    var SummaryDataView = CommonView.extend({

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
            this.$el.html(compiledTemplate);

            return this;
        }

    });

    return SummaryDataView;
});
