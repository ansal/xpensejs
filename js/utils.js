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

  // returns an array of object containing month with start date and end date
  // end date is mandatory
  Date.prototype.monthsInBetween = function(end) {

    if(!end || end < this) {
      throw new Error('Invalid date');
    }

    var startYear = this.getFullYear(),
        month,
        months = [],
        endYear = end.getFullYear(),
        startMonth = this.getMonth(),
        endMonth = end.getMonth();

    while(startYear < endYear) {
      months.push( new Date(startYear, startMonth, 1) );
      startMonth += 1;
      if(startMonth === 12) {
        startMonth = 0;
        startYear += 1;
      }
    }
    // remaining months if any when year becomes equal
    while(startMonth <= endMonth) {
      months.push( new Date(startYear, startMonth, 1) );
      startMonth += 1;
    }

    return months;

  };

})();