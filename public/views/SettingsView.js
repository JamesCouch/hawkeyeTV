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
            'click #save-btn'         : 'saveSettings'
        },

        saveSettings: function(evt){
            if(evt) evt.preventDefault();

            if(this.$("#settings-form").parsley('validate')){
                app.session.login({
                    username: this.$("#login-username-input").val(),
                    password: this.$("#login-password-input").val()
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

        render: function () {
          this.$el.html(this.template());
            return this;
        }
    });

    return SettingsView;
});
