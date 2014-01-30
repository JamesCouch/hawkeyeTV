
define([ 'jquery','underscore', 'text!templates/facebook.html', 'backbone'], function($, _, FbTpl,Backbone) {
    'use strict';

    var FacebookView = Backbone.View.extend({

    template: _.template(FbTpl),

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

    return FacebookView;
  });
