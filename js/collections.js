// Collections for XpenseJS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  // Collections hold all the collections
  X.Collections = {};

  // Collection for storing Categories
  var Categories = Backbone.Collection.extend({

    model: X.Models.Category,
    localStorage: new Backbone.LocalStorage('xpensejs-categories'),
    comparator: function( collection ){
      return( collection.get( 'title' ) );
    },

    // total amount spent monthly as an array of date and amount
    // if no category is specified, it will sum expenses from all categories
    getMonthlyExpenditure: function(start, end, category) {

      var months,
          monthlyExpenditures;

      if(!start || !end || end < start) {
        throw new Error('Invalid date');
      }

      months = start.monthsInBetween(end);
      monthlyExpenditures = _.map(months, function(m){
        var expense = {
          date: m
        };
        expense.amount = X.Collections.Expenses.getTotal(
          m,
          new Date(m.getFullYear(), m.getMonth(), m.daysInMonth()),
          category
        );
        return expense;
      });

      return monthlyExpenditures;

    }

  });

  // Collection for storing Expenses
  var Expenses = Backbone.Collection.extend({

    model: X.Models.Expense,
    localStorage: new Backbone.LocalStorage('xpensejs-expenses'),
    comparator: function( collection ){
      return - ( new Date(collection.get('date')).getTime() );
    },

    // filters expenses by date
    // if arguments are not present, it returns expenses for
    // current month
    filterByDate: function(start, end) {
      
      var currentDate = new Date;
      if(!start) {
        start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      }
      if(!end || end < start) {
        end = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.daysInMonth());
      }

      return this.filter(function(expense){
        var expenseDate = new Date (expense.get('date'));
        if(expenseDate >= start && expenseDate <= end) {
          return true;
        }
      });

    },

    // filters expenses by category
    // same date rule of filterByDate applies here as it users
    // filterByDate internally
    filterByCategory: function(category, start, end) {
      return this.filterByDate(start, end).filter(function(expense){
        return expense.get('category') === category ? true : false;
      });
    },

    // filters expenses by amount greater than amount argument provided
    // same date rule as filterByDate
    amountGt: function(amount, start, end, category) {
      if(!amount) {
        amount = 0;
      }

      if(!category) {
        return this.filterByDate(start, end).filter(function(expense){
          return expense.get('amount') >= amount ? true : false;
        });  
      } else {
        return this.filterByCategory(category, start, end).filter(function(expense){
          return expense.get('amount') >= amount ? true : false;
        });
      }
      
    },

    // filters expenses by amount lesser than amount argument provided
    // same date rule as filterByDate
    amountLt: function(amount, start, end, category) {
      if(!amount) {
        amount = 0;
      }

      if(!category) {
        return this.filterByDate(start, end).filter(function(expense){
          return expense.get('amount') <= amount ? true : false;
        });
      } else {
        return this.filterByCategory(category, start, end).filter(function(expense){
          return expense.get('amount') <= amount ? true : false;
        });
      }
      
    },

    // returns all satisfied expenses
    // same date rule as filterByDate
    getSatisfied: function(start, end, category) {
      if(!category) {
        return this.filterByDate(start, end).filter(function(expense){
          return expense.get('satisfied');
        });
      } else {
        return this.filterByCategory(category, start, end).filter(function(expense){
          return expense.get('satisfied');
        });
      }
    },

    // returns all dissatisfied expenses
    // same date rule as filterByDate
    getDissatisfied: function(start, end, category) {
      if(!category) {
        return this.filterByDate(start, end).filter(function(expense){
          return !expense.get('satisfied');
        });
      } else {
        return this.filterByCategory(category, start, end).filter(function(expense){
          return !expense.get('satisfied');
        });
      }
    },

    // returns total amount spent in a month
    // same date rule as filterByDate
    getTotal: function(start, end, category) {
      if(!category) {
        return this.filterByDate(start, end).reduce(function(sum, expense){
          return sum + expense.get('amount');
        }, 0);
      } else {
        return this.filterByCategory(category, start, end).reduce(function(sum, expense){
          return sum + expense.get('amount');
        }, 0);
      }
    }

  });

  // Collection for storing Targets
  var Targets = Backbone.Collection.extend({

    model: X.Models.Target,
    localStorage: new Backbone.LocalStorage('xpensejs-targets')

  });

  // create all collections and store it on Collections
  // object in XpenseJS app variable
  X.Collections.Categories = new Categories;
  X.Collections.Expenses = new Expenses;
  X.Collections.Targets = new Targets;

})();