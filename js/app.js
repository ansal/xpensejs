
// XpenseJS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  // Fetch all collections
  XpenseJS.Collections.Categories.fetch({ reset: true });
  XpenseJS.Collections.Expenses.fetch({ reset: true });

})();