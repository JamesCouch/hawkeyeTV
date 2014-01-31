define([ 'jquery','underscore', 'text!templates/forecast.html', 'models/ForecastModel', 'backbone'], function($, _, ForecastTpl, ForecastModel, Backbone) {
    'use strict';

    var ForecastView = Backbone.View.extend({

    template: _.template(ForecastTpl),

      initialize: function(options) {
        _.bindAll(this);
        this.forecastModel = new ForecastModel();
      },
      
      render: function () {
        var _this = this;  
        Backbone.ajax({
          dataType: "jsonp",
          url: "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/52242.json",
          data: "",
          success: function(val){
            _this.forecastModel.parse(val);
          }
        });
        this.$el.html(this.template());
        setTimeout( function () {
        }, 1000);
        return this;
      },

    });
    return ForecastView;
  });