define([
      'app/controller/MainController',
      'app/service/ESService'
    ],
		 function(MainController, ESService) {
			var app = angular.module('myApp', ['elasticsearch', 'angularModalService', 'ui-notification']);

      app.controller('MainController', MainController);
      app.service('ESService', ESService);
		});
