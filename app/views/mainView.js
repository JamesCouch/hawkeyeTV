
define([ 'jquery','underscore', 'text!templates/main.html', 'backbone', 'views/TimeView'], function($, _, MainTpl,Backbone, TimeView) {
    'use strict';

    var MainView = Backbone.View.extend({

    template: _.template(MainTpl),

      initialize: function(options) {
        _.bindAll(this);

        this.timeView = new TimeView();

        this.timeClass = $('#time');

        this.timeClass(this.timeView.render().$el);
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
