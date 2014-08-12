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

})();