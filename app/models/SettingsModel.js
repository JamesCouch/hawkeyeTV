
define(['underscore', 'backbone'],
  function(_, Backbone) {

    var Settings = Backbone.Model.extend({
      url: '/app/settings/settings.json',

      initialize: function() {


        this.fetching = this.fetch();

      },




    });

    return Settings;
  }
);