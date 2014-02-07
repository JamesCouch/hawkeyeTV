
define([ 'jquery','underscore', 'text!templates/main.html','text!templates/mainMobile.html', 'backbone', 'views/TimeView', 'views/ForecastView','socket'], function($, _, MainTpl,MobileMainTpl,Backbone, TimeView, ForecastView,socket) {
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
            "mouseover img"  : "mouseovercard"
      },


      onSelectionClick: function (e) {

        console.log("selection clicked");


       this.selection = $(event.target).attr('id');


       this.socket.emit('control',{action: this.selection});


        console.log("selection click: ", selection);
        this.trigger('renderSelection',selection);




      },

      mouseovercard: function(event) {
        $('.block').removeClass('selected');
        $(event.currentTarget).parent().toggleClass('selected');
      },
      
      render: function (state) {
        if (state == "tv"){
          this.$el.html(this.template());
          this.timeView = new TimeView();
          this.forecastView = new ForecastView();
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
