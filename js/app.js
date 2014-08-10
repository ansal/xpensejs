
// XpenseJS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  $(function(){
    
    // Fetch all collections
    X.Collections.Categories.fetch({ reset: true });
    X.Collections.Expenses.fetch({ reset: true });

    X.appRouter = new X.AppRouter;
    // Tells Backbone to start watching for hashchange events
    Backbone.history.start();

    var href = window.location;
    if(href.hash === '') {
      window.location.href = '#/dashboard';
    }

  });

})();