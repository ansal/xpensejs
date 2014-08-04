// Utils used in XpenseJtiS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  // Utils key hold all the utilities
  X.Utils = {};

  // this function returns number of days in a month
  // note that month is 0 based
  Date.prototype.daysInMonth = function(month) {
    if(!month) {
      month = this.getMonth();
    }
    var d = new Date(this.getFullYear(), month + 1, 0);
    return d.getDate();
  };

})();