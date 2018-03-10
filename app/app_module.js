define([
      'app/controller/TabsController',
      'app/controller/VisualizeController',
      'app/controller/PanelsController',
      'app/controller/DashboardController',
      'app/controller/ShowDashboardController',
      'app/controller/ShowListController',
      'app/controller/InitController',
      'app/service/ESService'
    ],
		 function(TabsController, VisualizeController, PanelsController, DashboardController, ShowDashboardController, ShowListController, InitController, ESService) {
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
            when('/Show', {
          		templateUrl: 'templates/showlist.html',
          		controller: 'ShowListController'
            }).
            when('/Show/:name*', {
          		templateUrl: 'templates/show.html',
          		controller: 'ShowDashboardController'
            }).
            when('/Init', {
              templateUrl: 'templates/init.html',
              controller: 'InitController'
            }).
            otherwise({
      		     redirectTo: '/Init'
            });
      }]);

      app.controller('TabsController', TabsController);
      app.controller('VisualizeController', VisualizeController);
      app.controller('PanelsController', PanelsController);
      app.controller('DashboardController', DashboardController);
      app.controller('ShowDashboardController', ShowDashboardController);
      app.controller('ShowListController', ShowListController);
      app.controller('InitController', InitController);
      app.service('ESService', ESService);
		});
