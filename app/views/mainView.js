
define([ 'jquery','underscore', 'text!templates/main.html', 'backbone'], function($, _, MainTpl,Backbone) {
    'use strict';

    var MainView = Backbone.View.extend({

    template: _.template(MainTpl),

      initialize: function(options) {
        _.bindAll(this);

      },

      events: {
            "click #selection-box"     : "onSelectionClick"
      },


      onSelectionClick: function (e) {

        var selection = $(event.target).parent().attr('class');
        console.log("selection click: ", selection);

        this.trigger('renderSelection',selection);


      },
      
      render: function () {
        this.$el.html(this.template());
            return this;
        },

    });

    return MainView;
  });
