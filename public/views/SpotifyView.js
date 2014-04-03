define([
    "app",
    "jquery",
    "underscore",

    "text!templates/spotify.html",

    "backbone",
    "parsley",
    "utils"
], function(app, $, _, SpotifyTpl, Backbone){

    var SpotifyView = Backbone.View.extend({

      template: _.template(SpotifyTpl),

        initialize: function () {
            _.bindAll(this);

            this.tracks = {
                first: "",
                second: "",
                third: "",
                fourth: "",
                fifth: ""
            };
        },

        events: {
            'click #search-btn'       : 'searchSpotify',
            'click #close-btn'        : 'closeSpotify',
            'click #state-btn'        : 'stateChange',
            'click #track1-btn'       : 'playTrack',
        },

        searchSpotify: function(evt){
            if(evt) evt.preventDefault();
            if(this.$("#spotify-form").parsley('validate')){
              this.search({
                  query: this.$("#search-input").val(),
              });
            }
        },

        closeSpotify: function() {
            this.$("#spotifyModal").modal('hide');
        },

        url: function(){
            return app.API + '/auth';
        },

        post: function(opts, callback, args){
            var _this = this;
            $.ajax({
                url: this.url() + '/' + opts.method,
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                data:  JSON.stringify( _.omit(opts, 'method') ),
                success: function(res){
                  _this.tracks = res;
                  console.log("success");
                  _this.displayTracks();
                }, error: function(res) {
                },
            });
        },

        stateChange: function(evt){
          if (this.$(evt.currentTarget).text() == "Play"){
            this.$(evt.currentTarget).html('Pause');
          } else if (this.$(evt.currentTarget).text() == "Pause") {
            this.pause({ playback: "pause", });
            this.$(evt.currentTarget).html('Resume');
          } else if (this.$(evt.currentTarget).text() == "Resume"){
            this.resume({ playback: "resume", });
            this.$(evt.currentTarget).html('Pause');
          }
        },

        displayTracks: function(){
          this.$('#tracks').show();
        },

        playTrack: function(){
          console.log(this.tracks.first.href);
          this.play({
            uri: this.tracks.first.href,
          });
          this.closeSpotify();
          this.trigger('refresh', "mobile");
        },

        search: function(opts, callback, args){
            this.post(_.extend(opts, { method: "search" }), callback);
        },

        play: function(opts, callback, args){
            this.post(_.extend(opts, { method: "play"}), callback);
        },

        pause: function(opts, callback, args){
            this.post(_.extend(opts, { method: "pause"}), callback);
        },

        resume: function(opts, callback, args){
            this.post(_.extend(opts, { method: "resume"}), callback);
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        }
    });

    return SpotifyView;
});
