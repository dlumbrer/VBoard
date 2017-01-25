define([
      'app/controller/MainController',
      'app/service/ESService'
    ],
		 function(MainController, ESService) {
			var app = angular.module('myApp', ['elasticsearch']);

      app.controller('MainController', MainController);
      app.service('ESService', ESService);
		});
