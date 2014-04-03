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
            'click #close-btn'        : 'closeSettings',
            'click #th-btn'           : 'toggleActive',
            'click #nw-btn'           : 'toggleActive'
        },

        saveSettings: function(evt){
            if(evt) evt.preventDefault();
            if(this.$("#settings-form").parsley('validate')){
                app.settings.update({
                    zipcode: this.$("#zipcode-input").val() || app.settings.profile.details.zipcode,
                    theme: this.$('#th').val() || app.settings.profile.details.theme,
                    news: this.$('#nw').val() || app.settings.profile.details.news,
                    id: 1
                }, {
                    success: function(mod, res){
                        if(DEBUG) console.log(mod, res);
                    },
                    error: function(mod, res){
                        if(DEBUG) console.log("ERROR", mod, res);
                    }
                });
                this.closeSettings();
                this.trigger('refresh', "tv");
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");
            }
        },

        toggleActive: function(evt) {
            if (evt.currentTarget.id == "th-btn") {
                this.$("#th-btn.btn.th.active").removeClass('active');
                this.$(evt.currentTarget).toggleClass('active');
            }
            else if (evt.currentTarget.id == "nw-btn") {
                this.$("#nw-btn.btn.nw.active").removeClass('active');
                this.$(evt.currentTarget).toggleClass('active');
            }
        },

        closeSettings: function() {
            this.$("#settingsModal").modal('hide');
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        }
    });

    return SettingsView;
});
