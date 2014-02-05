
define([ 'jquery','underscore', 'text!templates/main.html','text!templates/mainMobile.html', 'backbone', 'views/TimeView', 'views/ForecastView'], function($, _, MainTpl,MobileMainTpl,Backbone, TimeView, ForecastView) {
    'use strict';

    var MainView = Backbone.View.extend({

    template: _.template(MainTpl),
    templateMobile: _.template(MobileMainTpl),

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
      
      render: function (state) {
        if (state == "tv"){
          this.$el.html(this.template());
          this.timeView = new TimeView();
          this.forecastView = new ForecastView();
          this.timeView.setElement(this.$('#time')).render();
          this.forecastView.setElement(this.$('#forecast')).render();
        }
        else if(state == "mobile"){
          this.$el.html(this.templateMobile());
        }

        return this;
      },
    });

    return MainView;
  });
