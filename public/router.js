/**
 * @desc        backbone router for pushState page routing
 */

define(
  [
    'app',
    'jquery',
    'underscore',
    'backbone',
    'socket',
    'bootstrap',
    'twitter',
    
    'views/MainView',
    'views/YoutubeView',
    'views/GoogleView',
    'views/HeaderView',
    'views/SettingsView',
    'views/SearchBarView',

], function(app, $, _, Backbone, Socket, bootstrap,twitter, MainView, YoutubeView, GoogleView, HeaderView, SettingsView, SearchBarView){

    var WebRouter = Backbone.Router.extend({

      routes: {
        "":     "index"
      },

      initialize: function(options) {

        this.remoteSocket = io.connect('http://172.23.72.244:3000');

        this.screenSocket = io.connect('http://127.0.0.1:3000');

        this.isMobile = this.checkForMobile();
        var _this = this;
        if(this.isMobile){
          this.socket = this.remoteSocket;

          this.state = "mobile";
          this.remoteSocket.emit('remote');
        }
        else {
          this.socket = this.screenSocket;
          this.state = "tv";

          this.socket.on('connect', function(data){
            _this.socket.emit('screen');
          });
        }

        this.socket.on('controlling', function(data){
          _this.onRenderSelection(data);
        });

        this.socket.on('controlling-data', function(data){
          $('#searchBar').val(data);
        });

        this.socket.on('search-bar-control', function(data){
          if(data.action == "close"){
            $('#myModal').modal('hide');
          }
          else if(data.action == "submit"){
            $('#myModal').modal('hide');

            var currentView = _this.getCurrentSearchView(data.view);
            _this.showOnly(currentView);
            currentView.newSearch(data.data);
          }
        });

        this.views = [];
        this.$body = $("body");
        this.$header = $("header");

        this.mainView = new MainView({socket: this.socket, mobile: this.isMobile });
        this.mainView.on('renderSelection',this.onRenderSelection,this);
        this.views.push(this.mainView);

        this.headerView = new HeaderView();
        this.headerView.on('goBack', this.onGoBack,this);
        this.headerView.$el.hide();
        this.$header.prepend(this.headerView.render().$el);

        this.youtubeView = new YoutubeView({socket: this.socket, mobile: this.isMobile});
        this.youtubeView.$el.hide();
        this.$body.prepend(this.youtubeView.render().$el);
        this.views.push(this.youtubeView);

        this.googleView = new GoogleView();
        this.googleView.$el.hide();
        this.$body.prepend(this.googleView.render().$el);
        this.views.push(this.googleView);

        this.searchBarView = new SearchBarView({socket: this.socket});
        this.searchBarView.on('onCloseSearchBar',this.closeSearchBar,this);
        this.searchBarView.on('onSearchSubmit',this.submitSearchBar,this);
        this.searchBarView.$el.hide();
        this.$body.prepend(this.searchBarView.render().$el);
        this.views.push(this.searchBarView);

        this.settingsView = new SettingsView();
        this.settingsView.$el.hide();
        this.$body.prepend(this.settingsView.render().$el);
        this.views.push(this.settingsView);

        this.$body.prepend(this.mainView.render(this.state).$el);

        $('#searchBar').bind('input', function(e) {
            var searchBarData = $('#searchBar').val();
            _this.sendSearchBoxData(searchBarData);
        });
      },

      sendSearchBoxData: function(data) {
        this.remoteSocket.emit('send-data',{key: data});
      },

      onRenderSelection: function(chosenSelection) {
        if(chosenSelection == "youtube"){
          this.currentSearchBarView = "youtube";
          this.showSearchBar(chosenSelection);
        }
        if(chosenSelection == "chrome"){
          this.currentSearchBarView = "google";
          this.showSearchBar(chosenSelection);
        }
        if(chosenSelection == "settings"){
          // this.showOnly(this.settingsView);
          this.showSettingsModal();
        }
      },

      showSettingsModal: function() {

        this.settingsView.$el.show();
        $('#settingsModal').modal('show');


      },

      closeSettingsModal: function() {

      },

      showSearchBar: function(chosenSelection) {
        this.searchBarView.changeHeader(chosenSelection);
        this.searchBarView.$el.show();
        $('#myModal').modal('show');
      },

      closeSearchBar: function(){
        $('#myModal').modal('hide');
        this.remoteSocket.emit('modal-control',{action: 'close'});
      },

      submitSearchBar: function(data) {
        var data = $('#searchBar').val();
        $('#myModal').modal('hide');
        this.remoteSocket.emit('modal-control',{action: 'submit', data: data, view: this.currentSearchBarView});
        var currentView = this.getCurrentSearchView(this.currentSearchBarView);
        currentView.newSearch(data);
        this.showOnly(currentView);
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
          document.documentElement.scrollTop = document.documentElement.scrollTop = 0;
        }
      },

      checkForMobile: function() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
         return true;
        } else {
          return false;
        }
      },

      getCurrentSearchView: function(view){
        if(view == "youtube"){
          return this.youtubeView;
        }
        else if(view == "google"){
          return this.googleView;
        }
      }
    });

    return WebRouter;
});
