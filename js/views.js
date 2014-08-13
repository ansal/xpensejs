// Views for XpenseJS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  // Views key hold all the views
  X.Views = {};

  // Main view.
  // Mostly listens for touch events in add button, category list etc
  X.Views.AppMain = Backbone.View.extend({
    el: 'body',
    events: {
      'click #popup-link': 'showAddPopup',
      'click #add-category-link': 'addCategory',
      'click #add-expense-link': 'addExpense',
      'click #panel-close-button': 'closePanel'
    },

    updateMonthlyExpenditure: function() {
      $('#expense-amount').html( X.Collections.Expenses.getTotal() );
    },

    drawSatisfactionChart: function() {

      var expenses = XpenseJS.Collections.Expenses.filterByDate();
      if(expenses.length === 0) {
        $('#satisfied-chart-area').hide();
        return;
      } else {
        $('#satisfied-chart-area').show();
      }

      var ctx = document.getElementById("satisfied-chart").getContext("2d");
      var chart = new Chart(ctx).Pie([
        {
          value: XpenseJS.Collections.Expenses.getSatisfied().length,
          color: 'green',
          label: 'Satisfied spendings!'
        },
        {
          value: XpenseJS.Collections.Expenses.getDissatisfied().length,
          color: 'red',
          label: 'Dissatisfied spendings!'
        }
      ], {
        responsive: true,
        animation: false
      });
    },

    drawSpendingsChart: function() {

      var expenses = XpenseJS.Collections.Expenses.filterByDate();
      if(expenses.length === 0) {
        $('#spending-chart-area').hide();
        return;
      } else {
        $('#spending-chart-area').show();
      }

      var ctx = document.getElementById("spending-chart").getContext("2d");
      var labels = [];

      var today = new Date;
      var noDays = today.daysInMonth();
      for(var i = 1; i <= noDays; i += 1) {
        labels.push('' + i);
      }

      // Populate chart data with monthly data
      var data = [];
      var monthlyData = XpenseJS.Collections.Expenses.filterByDate();
      for(var i = 1; i <= noDays; i += 1) {
        var found = false;
        for(var j = 0; j < monthlyData.length; j+= 1) {
          var date = new Date( monthlyData[j].get('date') );
          if(date.getDay() === i) {
            data.push( monthlyData[j].get('amount') );
            found = true;
            break;
          }
        }
        if(!found) {
          data.push(0);
        }
      }

      var chartData = {
        labels: labels,
        datasets: [
          {
              label: "Daily Expenditure in this Month!",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: data
          }
        ]
      };

      var chart = new Chart(ctx).Line(chartData, {
        responsive: true,
        animation: false
      });

    },

    // Shows a popup where user can add stuff
    showAddPopup: function(e) {
      e.preventDefault();
      $('#add-popup').popup('open');
    },

    addCategory: function(e) {
      e.preventDefault();
      $('#add-popup').popup('close');
      var category = X.Collections.Categories.create({});
      window.location.href = '#/category/edit/' + category.get('id');
    },

    addExpense: function(e) {

      // Event handler for listening to first popup close event
      function addPopupClosed(e, popup) {
        // Check whether categories exist before adding expense
        // If no categories exist, ask user to create a category first
        if(X.Collections.Categories.length === 0) {
          $('#no-category-error').popup('open');
          $('#add-popup').off( "popupafterclose", addPopupClosed);
          return;
        }
        var expense = X.Collections.Expenses.create({
          category: X.Collections.Categories.models[0].id
        });
        window.location.href = '#/expense/edit/' + expense.get('id');
        $('#add-popup').off( "popupafterclose", addPopupClosed);
      }

      e.preventDefault();
      // Registering an event handler on close event prevents other modal window
      // not showing up 
      $('#add-popup').on( "popupafterclose", addPopupClosed);
      $('#add-popup').popup('close');
    },

    closePanel: function(e) {
      e.preventDefault();
    }

  });

  // Dashboard view
  X.Views.Dashboard = Backbone.View.extend({
    template: _.template( $('#dashboard-template').html() ),
    initialize: function() {

    },
    render: function() {
      var html = this.template({});
      this.$el.html( html );
      return this;
    }
  });

  // Edit Category View
  // This is also used for adding category
  X.Views.EditCategory = Backbone.View.extend({
    template: _.template( $('#edit-category-template').html() ),
    events: {
      'click #update-category-button': 'updateCategory'
    },
    initialize: function() {

    },
    render: function() {
      var html = this.template({
        category: this.model
      });
      this.$el.html( html );
      return this;
    },
    updateCategory: function(e) {
      e.preventDefault();
      var $button = $(e.target);
      $button.attr('disabled', true);
      var self = this;
      var input = $('#category-title').val();
      if(!input) {
        $('#update-category-error').popup('open');
        $button.attr('disabled', false);
        return;
      }
      // Convert into upper case before saving
      this.model.set('title', input[0].toUpperCase() + input.slice(1));
      this.model.save({}, {
        success: function() {
          window.location.href = '#/category/view/' + self.model.get('id');
        },
        error: function() {
          window.alert('Unfortunately this action could not be completed!');
        }
      });
    }
  });

  // List Category View
  X.Views.ListCategory = Backbone.View.extend({
    template: _.template( $('#category-list-template').html() ),
    render: function() {
      var html = this.template({
        categories: X.Collections.Categories.sort().models
      });
      this.$el.html( html );
      return this;
    }
  });

  // Individual Category View
  X.Views.SingleCategory = Backbone.View.extend({
    template: _.template( $('#category-view-template').html() ),
    events: {
      'click #delete-popup-button' : 'showDeletePopup',
    },

    render: function() {
      var html = this.template({
        category: this.model,
        expenses: X.Collections.Expenses.filterByCategory(this.model.get('id'))
      });
      this.$el.html( html );
      return this;
    },

    showDeletePopup: function(e) {
      e.preventDefault();
      var $popup = $('#delete-category-popup');
      $popup.popup('open');
    }

  });

  // Add/Update an expense
  X.Views.EditExpense = Backbone.View.extend({
    template: _.template( $('#edit-expense-template').html() ),
    events: {
      'click #update-expense-button': 'updateExpense',
      'change #satisfaction-yes': 'satisfiedYes',
      'change #satisfaction-no': 'satisfiedNo',
      'click #delete-popup-button': 'deleteExpense'
    },
    initialize: function() {

    },
    render: function() {
      var html = this.template({
        expense: this.model,
        categories: X.Collections.Categories.models
      });
      this.$el.html( html );
      return this;
    },
    satisfiedYes: function(e) {
      $('#satisfaction-no').prop('checked', false).checkboxradio('refresh');
    },
    satisfiedNo: function(e) {
      $('#satisfaction-yes').prop('checked', false).checkboxradio('refresh');
    },
    updateExpense: function(e) {

      // build form attributes and return an object
      // if validation fails returns undefined
      function buildAttrs() {
        var category = $('#expense-category'),
            title = $('#expense-title').val(),
            amount = $('#expense-amount').val(),
            satisfaction;
        satisfaction = $('#satisfaction-yes').prop('checked');
        category = X.Collections.Categories.get(category.val());

        if(!category || ! title || !amount || !category) {
          window.alert('Please provide all field values!');
          return;
        }

        amount = parseInt(amount);
        if(!amount || amount < 0) {
          window.alert('Invalid amount!');
          return;
        }

        return {
          category: category.get('id'),
          title: title,
          amount: amount,
          satisfied: satisfaction,
          date: new Date
        };

      }

      e.preventDefault();
      var expense = buildAttrs();
      if(typeof expense === 'undefined') {
        return;
      }
      // Convert into upper case before saving
      expense.title = expense.title[0].toUpperCase() + expense.title.slice(1);
      var self = this;
      this.model.save(expense, {
        success: function() {
          window.location.href = '#/category/view/' + self.model.get('category');
        },
        error: function() {
          window.alert('Unfortunately this action could not be completed!');
        }
      });
    },
    deleteExpense: function(e) {
      e.preventDefault();
      var confirmation = window.confirm('Are you sure?');
      if(!confirmation) {
        return;
      }
      var category = this.model.get('category');
      this.model.destroy();
      window.location.href = '#/category/view/' + category;
    }
  });

  // Settings View
  X.Views.Settings = Backbone.View.extend({
    template: _.template( $('#settings-template').html() ),
    events: {
      'click #clear-data-button' : 'clearData',
    },

    render: function() {
      var html = this.template({});
      this.$el.html( html );
      return this;
    },

    clearData: function() {
      var confirmation = confirm('WARNING!!!\n\nThis will delete everything!\n\nAre you sure?');
      if(!confirmation) {
        return;
      }
      localStorage.clear();
      window.location.href = '#/dashboard';
      window.location.reload();
    }

  });

  // About View
  X.Views.About = Backbone.View.extend({
    template: _.template( $('#about-template').html() ),

    render: function() {
      var html = this.template({});
      this.$el.html( html );
      return this;
    }

  });

})();