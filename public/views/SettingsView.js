define([
    "app",
    "jquery",
    "underscore",

    "text!templates/settings.html",

    "backbone",
    "parsley",
    "utils"
], function(app, $, _, SettingsTpl, Backbone){

    var SettingsView = Backbone.View.extend({

      template: _.template(SettingsTpl),

        initialize: function () {
            _.bindAll(this);
        },

        events: {
            'click #save-btn'         : 'saveSettings',
            'click #theme'            : 'toggleActive',
            'click #fb'               : 'toggleActive',
            'click #close-btn'        : 'closeSettings'
        },

        saveSettings: function(evt){
            if(evt) evt.preventDefault();
            if(this.$("#settings-form").parsley('validate')){
                app.settings.update({
                    zipcode: this.$("#zipcode-input").val() || app.settings.profile.details.zipcode,
                    theme: this.$('.btn.theme.active').text() || app.settings.profile.details.theme,
                    facebook: this.$('.btn.fb.active').text() || app.settings.profile.details.facebook,
                    twitter: this.$('#twitter-input').val() || app.settings.profile.details.twitter,
                    news: this.$('#news-input').val() || app.settings.profile.details.news,
                    id: 1
                }, {
                    success: function(mod, res){
                        if(DEBUG) console.log(mod, res);

                    },
                    error: function(mod, res){
                        if(DEBUG) console.log("ERROR", mod, res);
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");
            }
        },

        toggleActive: function(evt) {
            if (evt.currentTarget.id == "theme") {
                this.$(".btn.theme").removeClass('active');
                this.$(evt.currentTarget).toggleClass('active');
            }
            else if (evt.currentTarget.id == "fb") {
                console.log('IN');
                this.$(".btn.fb").removeClass('active');
                this.$(evt.currentTarget).toggleClass('active');
            }
        },

        closeSettings: function() {

        },

        render: function () {
          this.$el.html(this.template());
          return this;
        }
    });

    return SettingsView;
});