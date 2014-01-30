
define([ 'jquery','underscore', 'text!templates/settings.html', 'backbone'], function($, _, STpl,Backbone) {
    'use strict';

    var SettingsView = Backbone.View.extend({

    template: _.template(STpl),

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

    return SettingsView;
  });
