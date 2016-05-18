'use strict';

define([
	'jquery', 'underscore', 'backbone'
], function($, _, Backbone) {
    var CommonView = Backbone.View.extend({

        destroyView: function(){
			this.undelegateEvents();
			this.remove();
			Backbone.View.prototype.remove.call(this);
		}
        
    });

    return CommonView;
});
