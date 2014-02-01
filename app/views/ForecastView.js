define([ 'jquery','underscore', 'text!templates/forecast.html', 'models/ForecastModel', 'backbone'], function($, _, ForecastTpl, ForecastModel, Backbone) {
    'use strict';

    var ForecastView = Backbone.View.extend({

    template: _.template(ForecastTpl),

      initialize: function(options) {
        _.bindAll(this);
        this.forecastModel = new ForecastModel();
      },

      render: function () {
        this.$el.html(this.template());
        this.getWeather();
        return this;
      },

      getWeather: function() {
        var _this = this;
        Backbone.ajax({
          dataType: "jsonp",
          url: "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/52242.json",
          data: "",
          success: function(val){
            _this.forecastModel.parse(val);
            _this.setWeather();
          }
        });
        setTimeout( function () {
          _this.render();
        }, 60000);
      },

      setWeather: function() {
        this.$('#location').html("Forecast for " + this.forecastModel.index.location);
        this.$('#temperature').html("Temperature: " + this.forecastModel.index.temp);
        this.$('#feels-like').html("Real Feel: " + this.forecastModel.index.feels + "°F");
        this.$('#description').html("Conditions: " + this.forecastModel.index.descrip);
        this.$('#precip').html("Precipitation: " + this.forecastModel.index.precip + " inches");
        this.$('#wind').html("Wind: " + this.forecastModel.index.wind);
      },

    });

    return ForecastView;
  });