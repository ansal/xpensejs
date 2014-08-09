
// XpenseJS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  $(document).on('mobileinit', function(){

    // disable handlings of links and hashtagas by jquery mobile
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;

    // Fetch all collections
    X.Collections.Categories.fetch({ reset: true });
    X.Collections.Expenses.fetch({ reset: true });


  });

})();