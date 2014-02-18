
define([ 'jquery','underscore', 'text!templates/twitter.html', 'backbone'], function($, _, TwTpl,Backbone) {
    'use strict';

    var TwitterView = Backbone.View.extend({

    template: _.template(TwTpl),

      initialize: function(options) {
        _.bindAll(this);

          
        var error = function (err, response, body) {
            console.log('ERROR [%s]', err);
        };
        var success = function (data) {
            console.log('Data [%s]', data);
        };

        var config = {
            "consumerKey": "{hLYcPQ1m09bo29iTDDBeQ}",
            "consumerSecret": "{vwyZeWxp8FKxzsWyIQsgWscHL9gO5Z9t5uDiAflCXk}",
            "accessToken": "{84897293-RJWQgldHWvS5AsYdG76KA30XgjqFhwUjryiVzxWG7}",
            "accessTokenSecret": "{h3CpbH6nQFw1bZJjjExSDEG3xNIm0RwqgZAuWuRqc8GEN}",
            "callBackUrl": "{twitter/callback}"
        }


        // var twitter = new Twitter();
        // twitter.getUserTimeline({ screen_name: 'BoyCook', count: '10'}, error, success);
        // twitter.getMentionsTimeline({ count: '10'}, error, success);
        // twitter.getHomeTimeline({ count: '10'}, error, success);
        // twitter.getReTweetsOfMe({ count: '10'}, error, success);
        // twitter.getTweet({ id: '1111111111'}, error, success);





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
