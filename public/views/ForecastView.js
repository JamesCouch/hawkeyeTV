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
        $.ajax({
          dataType: "json",
          url: "https://maps.googleapis.com/maps/api/geocode/json?address=60013&sensor=true",
          data: "",
          success: function(val){
            _this.forecastModel.parse(val);
            _this.setWeather();
          }
        });
        setTimeout( function () {
          _this.getWeather();
        }, 900000);
      },

      setWeather: function() {
        this.src = "http://forecast.io/embed/#lat="+ this.forecastModel.index.lat + "&lon=" + this.forecastModel.index.lon +"&name=" + this.forecastModel.index.name;
        this.$('#forecast_embed').attr('src', this.src);
      },

    });

    return ForecastView;
  });