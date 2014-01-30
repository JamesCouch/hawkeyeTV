
define([ 'jquery','underscore', 'text!templates/main.html', 'backbone'], function($, _, MainTpl,Backbone) {
    'use strict';

    var MainView = Backbone.View.extend({

    template: _.template(MainTpl),

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

    return MainView;
  });
