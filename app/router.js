
define(
  [
    'jquery',
    'underscore',
    'backbone',
    'views/MainView',
    'views/YoutubeView',
    'views/GoogleView',
    'views/HeaderView',
    'views/SettingsView',
    'models/SettingsModel',
    'exports',
    'module',],

  function(
    $,
    _,
    backbone,
    MainView,
    YoutubeView,
    GoogleView,
    HeaderView,
    SettingsView,
    SettingsModel,
    exports,
    module) {

    'use strict';


    module.exports = Backbone.Router.extend({

      routes: {
        "":"index"
      },

      initialize: function(options) {
        this.views = [];
        this.$body = $("appBody");
        this.$header = $("header");

        //Initialize Models
        this.settings = new SettingsModel();
        this.fetchingSettings = this.settings.fetch();
  
        $.when(this.fetchingSettings).done(_.bind(function() {

          this.settingsView = new SettingsView({model: this.settings});
          this.settingsView.$el.hide();
          this.$body.prepend(this.settingsView.render().$el);
          this.views.push(this.settingsView);

        },this));

        //Initialize Views


        this.mainView = new MainView();
        this.mainView.on('renderSelection',this.onRenderSelection,this);
        this.views.push(this.mainView);

        this.headerView = new HeaderView();
        this.headerView.on('goBack', this.onGoBack,this);
        this.headerView.$el.hide();
        this.$header.prepend(this.headerView.render().$el);

        this.youtubeView = new YoutubeView();
        this.youtubeView.$el.hide();
        this.$body.prepend(this.youtubeView.render().$el);
        this.views.push(this.youtubeView);

        this.googleView = new GoogleView();
        this.googleView.$el.hide();
        this.$body.prepend(this.googleView.render().$el);
        this.views.push(this.googleView);






        this.$body.prepend(this.mainView.render().$el);

      },

      onRenderSelection: function(chosenSelection) {

        if(chosenSelection == "youtube-search"){
          this.showOnly(this.youtubeView);
        }
        if(chosenSelection == "google-search"){
          this.showOnly(this.googleView);
        }

        if(chosenSelection == "settings"){
          this.showOnly(this.settingsView);
        }


      },

      onGoBack: function() {
        this.showOnly(this.mainView);
      },

      showOnly: function(view){
        if (view != this.currentView) {
          _.each(this.views, function (view) { view.$el.hide(); } );

          if (view.show) {
            view.show();
          }
          else {
            if(view == this.mainView){
              this.headerView.$el.hide();
            }
            else{ this.headerView.$el.show(); }
            view.$el.show();
          }
          this.currentView = view;
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
      }
    });
});
