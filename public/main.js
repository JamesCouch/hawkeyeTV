/**
 * Main app initialization and initial auth check
 */

require([
    "app",
    "router"
],
function(app, WebRouter) {

    // Just use GET and POST to support all browsers
    Backbone.emulateHTTP = true;

    app.router = new WebRouter();

    // Trigger the initial route and enable HTML5 History API support, set the
    // root folder to '/' by default.  Change in app.js.
    Backbone.history.start({ pushState: true, root: app.root });
});

