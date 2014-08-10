// Routes for XpenseJS app

// Global XpenseJS app variable
var XpenseJS = XpenseJS || {};

(function(){
  'use strict';

  // shortcut for XpenseJS app variable
  var X = XpenseJS;

  // Container where other views are injected
  var $container = $('#app-container');

  // Pre actions for router
  function routerPreActions(config) {
    if(config && config.appTitle){
      $('#app-title').text(config.appTitle);
    }
    $('#category-panel').panel('close');
    $.mobile.loading('show');
    if(X.currentView) {
      X.currentView.remove();
    }
  }

  // App router
  X.AppRouter = Backbone.Router.extend({
    initialize: function(){
      // when app is loaded, create a new main view and store it in the 
      // current view variable
      X.appMainView = new X.Views.AppMain;
    },
    
    routes: {
      'dashboard' : 'dashboard',

      // Category
      'category': 'listCategory',
      'category/edit/:id': 'editCategory',
      'category/view/:id': 'viewCategory',
      // This is a temporary fix to the problem of click events not firing
      'category/destroy/:id': 'destroyCategory'
    },

    dashboard: function() {
      routerPreActions({
        appTitle: 'Dashboard'
      });
      if(X.currentView) {
        X.currentView.remove();
      }
      X.currentView = new X.Views.Dashboard;
      $container.html( X.currentView.render().$el );
      $.mobile.loading('hide');
    },

    editCategory: function(id) {
      var category = X.Collections.Categories.get(id);
      // TODO: Show error if id is invalid
      routerPreActions({
        appTitle: 'Editing ' + category.get('title')
      });
      X.currentView = new X.Views.EditCategory({ model: category });
      $container.html( X.currentView.render().$el );
      $container.trigger('create');
      $.mobile.loading('hide');
    },

    listCategory: function() {
      routerPreActions({
        appTitle: 'Categories'
      });
      X.currentView = new X.Views.ListCategory;
      $container.html( X.currentView.render().$el );
      $container.trigger('create');
      $.mobile.loading('hide');
    },

    viewCategory: function(id) {
      // Prevents a bug which caches id!!!
      $('#delete-category-popup').remove();
      var category = X.Collections.Categories.get(id);
      // TODO: Show error if id is invalid
      routerPreActions({
        appTitle: category.get('title')
      });
      X.currentView = new X.Views.SingleCategory({ model: category });
      $container.html( X.currentView.render().$el );
      $container.trigger('create');
      $.mobile.loading('hide');
    },

    // Temporary fix to delete a category
    destroyCategory: function(id) {
      $('#delete-category-popup').remove();
      var category = X.Collections.Categories.get(id);
      // TODO: Show error if id is invalid
      routerPreActions();
      category.destroy();
      window.location.href = '#/category';
      $.mobile.loading('hide');
    }
  });

})();