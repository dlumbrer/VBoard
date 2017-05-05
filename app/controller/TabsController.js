define(
		function() {
      function TabsController($scope,$location, esFactory, ESService, ModalService, Notification) {

				////////////////////////////
				$scope.navClass = function (page) {
					 var currentRoute = $location.path().substring(1) || 'Visualize';
					 return page === currentRoute ? 'active' : '';
				 };

				$scope.loadVisualize = function () {
					$location.url('/Visualize');
				};
				$scope.loadPanels = function () {
					$location.url('/Panels');
				};
				$scope.loadDashboard = function () {
					$location.url('/Dashboard');
				};


      }

      TabsController.$inject = [ '$scope', '$location' ,'esFactory', 'ESService', 'ModalService', 'Notification'];

			return TabsController;

});
