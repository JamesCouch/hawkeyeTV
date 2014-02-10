
define([ 'jquery','underscore', 'text!templates/youtube.html', 'backbone','Mustache','touchswipe','scrollTo','socket'], function($, _, YtTpl,Backbone,Mustache,touchswipe,scrollTo,Socket) {
    'use strict';

    var YoutubeView = Backbone.View.extend({

    template: _.template(YtTpl),

      initialize: function(options) {
        _.bindAll(this);

        this.socket = options.socket;

        this.socket.on('swipe-control', function(data){
          
          if(data.direction == "up"){

            var string = "+="+data.distance+"px";
            console.log("scrolled: ", string);
            $.scrollTo(string,800);

          }

          else if(data.direction == "down"){

          }


        });



      },

      newSearch: function(data) {

        this.currentVid = 0;

        console.log("new search: ", data);

        $('.searchInput').text("Your youtube search is: " + data);

        var max_videos = 12;
        var url = "http://gdata.youtube.com/feeds/api/videos?vq=" + escape(data) + "&max-results=" + max_videos + "&alt=json-in-script&callback=?";

        var _this = this;

        $.getJSON(url, function(data){
          $("ul.video").html("");
          var jsonObj = [];
          $(data.feed.entry).each(function(key, item){
            var a = item.id.$t.split("/"),
              id = a[6],
              title = item.title.$t,
              thumbnail = item.media$group.media$thumbnail[0].url,
              totalSec = item.media$group.yt$duration.seconds,
              hours = parseInt( totalSec / 3600 ) % 24,
              minutes = parseInt( totalSec / 60 ) % 60,
              seconds = totalSec % 60;

            var duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);


            jsonObj = {
              id:id,
              title:title,
              thumbnail:thumbnail,
              duration:duration,
              vidNumber: this.currentVid++};


             var template = $('#videoTpl').html(),
               html = Mustache.to_html(template, jsonObj);
             $('ul.video').append(html); 


          });
        });

     
              $(".youtubeView").swipe( {
                allowPageScroll:"auto",
                swipe:function(event, direction, distance, duration, fingerCount) {

                _this.socket.emit('swipe',{direction: direction, distance: distance});

                },
                threshold:0,
                fingers:'all'
              });


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
