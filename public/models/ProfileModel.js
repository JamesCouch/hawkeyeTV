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
                theme: "Default",
                facebook: "Disabled", 
                twitter: "Disabled",
                news: "Disabled",
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

