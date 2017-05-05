define(
		function() {
      function DashboardController($scope, esFactory, ESService, ModalService, Notification) {
				angular.element(document).ready(function () {

					var generatorQueries = genES()
					var builderData = builderESDS()
					var bodybuilder = require('node_modules/bodybuilder/browser/bodybuilder.min')



					///////////////////////////////////////////THREEDC/////////////////////////////////////////
					var container = document.getElementById( 'ThreeJSDashboard' );

					var dash = THREEDC.dashBoard(container);



					/////////////////////////////////////////////////////////////////////////////////////

				});
      }

      DashboardController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return DashboardController;

});
