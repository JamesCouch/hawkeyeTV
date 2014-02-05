define([ 'jquery','underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    var ForecastModel = Backbone.Model.extend({

      initialize: function(options) {
        _.bindAll(this);

        this.index = {};
      },

      parse: function(val) {
        this.index.location = val.current_observation.display_location.full;
        this.index.temp = val.current_observation.temperature_string;
        this.index.wind = val.current_observation.wind_string;
        this.index.feels = val.current_observation.feelslike_f;
        this.index.descrip = val.current_observation.weather;
        this.index.precip = val.current_observation.precip_today_in;
      },

    });

    return ForecastModel;
  });