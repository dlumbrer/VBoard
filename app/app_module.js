define([
      'app/controller/TabsController',
      'app/controller/MainController',
      'app/service/ESService'
    ],
		 function(TabsController, MainController, ESService) {
			var app = angular.module('myApp', ['elasticsearch', 'angularModalService', 'ui-notification', 'ui.bootstrap']);

      app.controller('TabsController', TabsController);
      app.controller('MainController', MainController);
      app.service('ESService', ESService);
		});
