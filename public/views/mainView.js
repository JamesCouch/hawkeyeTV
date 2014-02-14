
define([ 'jquery','underscore', 'text!templates/main.html','text!templates/mainMobile.html', 'backbone', 'views/TimeView', 'views/ForecastView','socket','views/twitterView'], function($, _, MainTpl,MobileMainTpl,Backbone, TimeView, ForecastView,socket,TwitterView) {
    'use strict';

    var MainView = Backbone.View.extend({

    template: _.template(MainTpl),
    templateMobile: _.template(MobileMainTpl),

      initialize: function(options) {
        _.bindAll(this);

        this.socket = options.socket;
        this.isMobile = options.mobile;
        var _this = this;
      },

      events: {
        "click #selection-box"     : "onSelectionClick",
        "mouseover img"            : "mouseovercard"
      },

      onSelectionClick: function (e) {
        this.selection = $(event.target).attr('id');
        this.socket.emit('control',{action: this.selection});
        console.log("selection click: ", this.selection);
        this.trigger('renderSelection',this.selection);
      },

      mouseovercard: function(event) {
        if (this.isMobile){

        } else {
          $('.block').removeClass('selected');
          $(event.currentTarget).parent().toggleClass('selected');
        }
      },
      
      render: function (state) {
        if (state == "tv"){
          this.$el.html(this.template());
          this.twitterView = new TwitterView();
          this.timeView = new TimeView();
          this.forecastView = new ForecastView();
          this.twitterView.setElement(this.$('.tw-feed')).render();
          this.timeView.setElement(this.$('#time')).render();
          this.forecastView.setElement(this.$('#forecast')).render();
        }
        else if(state == "mobile"){
          this.$el.html(this.templateMobile());
        }

        return this;
      },
      
    });

    return MainView;
  });
