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
    if(config.appTitle){
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
      'category/edit/:id': 'editCategory',
      'category': 'listCategory'
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
    }
  });

})();