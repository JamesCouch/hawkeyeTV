
define(
  [
    'jquery',
    'underscore',
    'backbone',
    'views/MainView',
    'exports',
    'module'],

  function(
    $,
    _,
    backbone,
    MainView,
    exports,
    module) {

    'use strict';


    module.exports = Backbone.Router.extend({

      routes: {
        "":"index"
      },

      initialize: function(options) {

        





      }

    });



});
   