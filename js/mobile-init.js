// Mobile init module

(function(){
  'use strict';

  $(function(){
    // disable handlings of links and hashtagas by jquery mobile
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;

  });

})();