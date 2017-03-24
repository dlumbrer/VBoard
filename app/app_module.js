define([
      'app/controller/TabsController',
      'app/controller/VisualizeController',
      'app/service/ESService'
    ],
		 function(TabsController, VisualizeController, ESService) {
			var app = angular.module('myApp', ['elasticsearch', 'angularModalService', 'ui-notification', 'ui.bootstrap']);

      app.controller('TabsController', TabsController);
      app.controller('VisualizeController', VisualizeController);
      app.service('ESService', ESService);
		});
