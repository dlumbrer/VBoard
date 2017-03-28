define([
      'app/controller/TabsController',
      'app/controller/VisualizeController',
      'app/controller/PanelsController',
      'app/service/ESService'
    ],
		 function(TabsController, VisualizeController, PanelsController, ESService) {
			var app = angular.module('myApp', ['elasticsearch', 'angularModalService', 'ui-notification', 'ui.bootstrap']);

      app.controller('TabsController', TabsController);
      app.controller('VisualizeController', VisualizeController);
      app.controller('PanelsController', PanelsController);
      app.service('ESService', ESService);
		});
