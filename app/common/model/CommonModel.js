define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var CommonModel = Backbone.Model.extend({

        initialize: function(data, options) {
            this.options = options;
            if(this.options && this.options.url){
                this.url = this.options.url;
                this.fetch({cache: false,reset: true});
            }
        }
    });

    return CommonModel;
});
