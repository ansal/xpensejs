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
          window.location.href = '#/category';
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

})();