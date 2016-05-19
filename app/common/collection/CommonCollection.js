define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var CommonCollection = Backbone.Collection.extend({

        initialize: function(data, options) {
            this.options = options;
            if(this.options && this.options.url){
                this.url = this.options.url;
                this.fetch({cache: false,reset: true});
            }
        }
    });

    return CommonCollection;
});
