
define([ 'jquery','underscore', 'text!templates/twitter.html', 'backbone'], function($, _, TwTpl,Backbone) {
    'use strict';

    var TwitterView = Backbone.View.extend({

    template: _.template(TwTpl),

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

    return TwitterView;
  });
