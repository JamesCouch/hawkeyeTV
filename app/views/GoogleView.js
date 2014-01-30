
define([ 'jquery','underscore', 'text!templates/google.html', 'backbone'], function($, _, GTpl,Backbone) {
    'use strict';

    var GoogleView = Backbone.View.extend({

    template: _.template(GTpl),

      initialize: function(options) {
        _.bindAll(this);

        


      },

      events: {
            "click #logout-link"            : "onLogoutClick",
            "click #remove-account-link"    : "onRemoveAccountClick"
      },
      
      render: function () {
        this.$el.html(this.template());
            return this;
        },

    });

    return GoogleView;
  });
