// Models for XpenseJS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  // Models hold all the app models
  X.Models = {};

  // Expense Category. For example Food, Transort, Rent
  X.Models.Category = Backbone.Model.extend({

    defaults: {
      title: 'Untitled Category'
    }

  });

  // This is the expense model. It has a field for category which relates -
  // back to category
  X.Models.Expense = Backbone.Model.extend({

    defaults: {
      title: 'Untitled Expense',
      amount: 0,
      satisfied: true,
      date: new Date
    }

  });

  // Target limit for a particular month. A month usually has only -
  // one target
  X.Models.Target = Backbone.Model.extend({

    defaults: {
      target: 0,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    }

  });

})();