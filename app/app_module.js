define([
      'app/controller/TabsController',
      'app/controller/VisualizeController',
      'app/controller/PanelsController',
      'app/controller/DashboardController',
      'app/service/ESService'
    ],
		 function(TabsController, VisualizeController, PanelsController, DashboardController, ESService) {
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
            when('/Dashboard', {
          		templateUrl: 'templates/dashboard.html',
          		controller: 'DashboardController'
            }).
            otherwise({
      		     redirectTo: '/Visualize'
            });
      }]);

      app.controller('TabsController', TabsController);
      app.controller('VisualizeController', VisualizeController);
      app.controller('PanelsController', PanelsController);
      app.controller('DashboardController', DashboardController);
      app.service('ESService', ESService);
		});
