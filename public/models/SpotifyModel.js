define([
    "app",
    "models/ProfileModel",
    "utils"
], function(app, ProfileModel){

    var SpotifyModel = Backbone.Model.extend({

        initialize: function(){
            _.bindAll(this);

            this.tracks = {
                first: "",
                second: "",
                third: "",
                fourth: "",
                fifth: ""
            };
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
                  this.tracks = res;
                }, error: function(res) {
                },
            });
        },

        search: function(opts, callback, args){
            this.post(_.extend(opts, { method: 'search' }), callback);
        },

        play: function(opts, callback, args){
            this.post(_.extend(opts, { method: "play"}), callback);
        },

        pause: function(opts, callback, args){
            this.post(_.extend(opts, { method: "pause"}), callback);
        },

        resume: function(opts, callback, args){
            this.post(_.extend(opts, { method: "resume"}), callback);
        }

    });

    return SpotifyModel;
});
