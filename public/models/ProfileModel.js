define([
    "app",
    "utils"
], function(app){

    var ProfileModel = Backbone.Model.extend({

        initialize: function(){
            _.bindAll(this);

            this.details = { 
                id: "0", 
                zipcode: "52242", 
                facebook: "disabled", 
                twitter: "disabled",
                news: "disabled",
                ip_addr: "192.168.1.10"
            };    
        },

        url: function(){
            return app.API + '/profile';
        },

        setDetails: function(details) {
            this.details = details;
        }

    });
    
    return ProfileModel;
});

