define([
      'app/controller/TabsController',
      'app/controller/VisualizeController',
      'app/controller/PanelsController',
      'app/service/ESService'
    ],
		 function(TabsController, VisualizeController, PanelsController, ESService) {
			var app = angular.module('myApp', ['ngRoute', 'elasticsearch', 'angularModalService', 'ui-notification', 'ui.bootstrap']);

      app.config(['$routeProvider',
        function($routeProvider) {
          $routeProvider.
            when('/Visualize', {
          		templateUrl: 'templates/visualize.html',
          		controller: 'VisualizeController'
      	}).
            when('/Panels', {
          		templateUrl: 'templates/panels.html',
          		controller: 'PanelsController'
            }).
            otherwise({
      		     redirectTo: '/Visualize'
            });
      }]);

      app.controller('TabsController', TabsController);
      app.controller('VisualizeController', VisualizeController);
      app.controller('PanelsController', PanelsController);
      app.service('ESService', ESService);
		});
