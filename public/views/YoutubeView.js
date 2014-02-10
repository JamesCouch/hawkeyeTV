
define([ 'jquery','underscore', 'text!templates/youtube.html', 'backbone'], function($, _, YtTpl,Backbone) {
    'use strict';

    var YoutubeView = Backbone.View.extend({

    template: _.template(YtTpl),

      initialize: function(options) {
        _.bindAll(this);

        


      },

      newSearch: function(data) {

        console.log("new search: ", data);


        $('.searchInput').text("Your youtube search is: " + data);

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

    return YoutubeView;
  });
