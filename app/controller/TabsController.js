define(
		function() {
      function TabsController($scope, $rootScope, $location, esFactory, ESService, ModalService, Notification) {

				////////////////////////////
				$scope.navClass = function (page) {
					 var currentRoute = $location.path().substring(1) || 'Visualize';
					 return page === currentRoute ? 'active' : '';
				 };

				$scope.loadVisualize = function () {
					//Eliminar anterior escena//
					$rootScope.actualdash.removeAllCharts();
					for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
						$rootScope.actualdash.panels[i].remove()
					}
					//////////////////////////
					$scope.showSelected = false;
					$location.url('/Visualize');
				};
				$scope.loadPanels = function () {
					$rootScope.actualdash.removeAllCharts();
					for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
						$rootScope.actualdash.panels[i].remove()
					}
					$scope.showSelected = false;
					$location.url('/Panels');
				};
				$scope.loadDashboard = function () {
					$rootScope.actualdash.removeAllCharts();
					for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
						$rootScope.actualdash.panels[i].remove()
					}
					$scope.showSelected = false;
					$location.url('/Dashboard');
				};
				$scope.loadShow = function () {
					$location.url('/Show');
				};


      }

      TabsController.$inject = [ '$scope', '$rootScope', '$location' ,'esFactory', 'ESService', 'ModalService', 'Notification'];

			return TabsController;

});
