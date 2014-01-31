define([ 'jquery','underscore', 'text!templates/time.html', 'backbone'], function($, _, TimeTpl,Backbone) {
    'use strict';

    var TimeView = Backbone.View.extend({

    template: _.template(TimeTpl),

      initialize: function(options) {
        _.bindAll(this);
      },
      
      render: function () {
        this.$el.html(this.template());
        return this;
      },

    });

    return TimeView;
  });