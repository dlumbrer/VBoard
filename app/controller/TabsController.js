define(
		function() {
      function TabsController($scope, $rootScope, $location, esFactory, ESService, ModalService, Notification) {

				$scope.navClass = function (page) {
					 var currentRoute = $location.path().substring(1) || 'Visualize';
					 return page === currentRoute ? 'active' : '';
				 };

				$scope.loadVisualize = function () {
					$scope.showSelected = false;
					$location.url('/Visualize');
				};
				$scope.loadDashboard = function () {
					$scope.showSelected = false;
					$location.url('/Dashboard');
				};
				$scope.loadShow = function () {
					$scope.showSelected = true;
					$location.url('/Show');
				};


      }

      TabsController.$inject = [ '$scope', '$rootScope', '$location' ,'esFactory', 'ESService', 'ModalService', 'Notification'];

			return TabsController;

});
