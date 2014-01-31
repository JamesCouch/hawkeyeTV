define([ 'jquery','underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    var ForecastModel = Backbone.Model.extend({

      initialize: function(options) {
        _.bindAll(this);

        this.index = {};
      },

      parse: function(val) {
        this.index.city = val.current_observation.display_location.city;
      },

    });

    return ForecastModel;
  });