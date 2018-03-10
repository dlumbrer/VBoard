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
					if($rootScope.actualdash){
						$rootScope.actualdash.removeAllCharts();
						for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
							$rootScope.actualdash.panels[i].remove()
						}
					}
					//////////////////////////
					$scope.showSelected = false;
					$location.url('/Visualize');
				};
				$scope.loadPanels = function () {
					if ($rootScope.actualdash) {
						$rootScope.actualdash.removeAllCharts();
						for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
							$rootScope.actualdash.panels[i].remove()
						}
					}
					$scope.showSelected = false;
					$location.url('/Panels');
				};
				$scope.loadDashboard = function () {
					if ($rootScope.actualdash) {
						$rootScope.actualdash.removeAllCharts();
						for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
							$rootScope.actualdash.panels[i].remove()
						}
					}
					$scope.showSelected = false;
					$location.url('/Dashboard');
				};
				$scope.loadShow = function () {
					if ($rootScope.actualdash) {
						$rootScope.actualdash.removeAllCharts();
						for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
							$rootScope.actualdash.panels[i].remove()
						}
					}
					$scope.showSelected = true;
					$location.url('/Show');
				};


      }

      TabsController.$inject = [ '$scope', '$rootScope', '$location' ,'esFactory', 'ESService', 'ModalService', 'Notification'];

			return TabsController;

});
