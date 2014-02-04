
define([ 'jquery','underscore', 'text!templates/settings.html', 'backbone'], function($, _, STpl,Backbone) {
    'use strict';

    var SettingsView = Backbone.View.extend({

    template: _.template(STpl),

      initialize: function(options) {
        _.bindAll(this);

        this.model = options.model;
        
        this.zipCode = this.model;


        console.log(this.zipCode.get("userName"));

      },

      events: {
            "click #logout-link"            : "onLogoutClick"
      },
      
      render: function () {
        this.$el.html(this.template());
            return this;
        },

    });

    return SettingsView;
  });
