
define([ 'jquery','underscore', 'text!templates/twitter.html', 'backbone','twitter'], function($, _, TwTpl,Backbone,twitter) {
    'use strict';

    var TwitterView = Backbone.View.extend({

    template: _.template(TwTpl),

      initialize: function(options) {
        _.bindAll(this);


       // var config = {
       //      "consumerKey": "",
       //      "consumerSecret": "",
       //      "accessToken": "84897293-RJWQgldHWvS5AsYdG76KA30XgjqFhwUjryiVzxWG7",
       //      "accessTokenSecret": "h3CpbH6nQFw1bZJjjExSDEG3xNIm0RwqgZAuWuRqc8GEN",
       //      "callBackUrl": "{callBackUrl}"
       //  }

       //  var twitter = new Twitter(config);
       //  twitter.getUserTimeline({ screen_name: 'BoyCook', count: '10'}, error, success);
       //  // twitter.getMentionsTimeline({ count: '10'}, error, success);
       //  // twitter.getHomeTimeline({ count: '10'}, error, success);
       //  // twitter.getReTweetsOfMe({ count: '10'}, error, success);
       //  // twitter.getTweet({ id: '1111111111'}, error, success);




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
