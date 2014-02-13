
define([ 'jquery','underscore', 'text!templates/youtube.html','text!templates/youtubePlay.html','text!templates/youtubeRemote.html', 'backbone','Mustache','touchswipe','scrollTo','socket','yt'], function($, _, YtTpl,YtPlayTpl,YtRemoteTpl,Backbone,Mustache,touchswipe,scrollTo,Socket,yt) {
    'use strict';

    var YoutubeView = Backbone.View.extend({

    template: _.template(YtTpl),
    templatePlay: _.template(YtPlayTpl),
    templateRemote: _.template(YtRemoteTpl),

      initialize: function(options) {
        _.bindAll(this);

        this.socket = options.socket;
        this.isMobile = options.mobile;
        var _this = this;

        this.socket.on('swipe-control', function(data){
          
          if(data.direction == "up"){

            var string = "+="+data.distance+"px";
            console.log("scrolled: ", string);
            $.scrollTo(string,800);

          }

          else if(data.direction == "down"){

          }


        });

        this.socket.on('youtube-control', function(data){

           _this.$el.html(_this.templatePlay());

           _this.playVideo(data.id);

        });

        this.socket.on('youtube-toggle-control', function(data){

          if(data.action == false){
          $('.playPauseButton').attr('src','assets/img/playbutton.svg');
            _this.player.pauseVideo();
          }
          if(data.action == true){
          $('.playPauseButton').attr('src','assets/img/pausebutton.png');
            _this.player.playVideo();
          }

        });



      },

      events: {
            "click .videoBlock"            : "onClickVideo",
             "click .playPauseButton"       : "toggleVideo"
      },

      playVideo: function(id) {

              var width = $(window).width();
              var height = $(window).height();

              this.videoState = true;

              var _this = this;

              this.player = {
                  loadPlayer: function() {
                      new YT.Player('player', {
                          videoId: id,
                          width: width,
                          height: height,
                          playerVars: {
                              playsinline: 1,
                              autoplay: 0,
                              controls: 0,
                              rel: 0,
                              showInfo: 0
                          },
                          events: {
                            'onReady': onPlayerReady
                            // 'onStateChange': onPlayerStateChange
                          }
                      });
                  }
              };

              this.player.loadPlayer();


        // 4. The API will call this function when the video player is ready.
              function onPlayerReady(event) {
                var obj = event.target;
                event.target.playVideo();
                 console.log(event.target);
                 return event.object;
              }

              // 5. The API calls this function when the player's state changes.
              //    The function indicates that when playing a video (state=1),
              //    the player should play for six seconds and then stop.
              // var done = false;
              // function onPlayerStateChange(event) {
              //   if (event.data == YT.PlayerState.PLAYING && !done) {
              //     setTimeout(stopVideo, 6000);
              //     done = true;
              //   }
              // }
              // function stopVideo() {
              //   player.stopVideo();
              // }

      },


      toggleVideo: function() {


          this.socket.emit('toggle-youtube',{action: this.videoState});

          this.videoState = !this.videoState;


      },



      onClickVideo: function(e) {


        if(this.isMobile){

          this.selection = $(event.target).attr('id');

          this.socket.emit('play-youtube',{id: this.selection});

          this.$el.html(this.templateRemote());

          $('.playPauseButton').attr('src','assets/img/pausebutton.png');

        }


      },

      newSearch: function(data) {


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


      
      render: function () {
        this.$el.html(this.template());
            return this;
        },

    });

    return YoutubeView;
  });
