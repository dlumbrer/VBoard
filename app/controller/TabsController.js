define(
	function () {
		function TabsController($scope, $rootScope, $location, esFactory, ESService, ModalService, Notification) {

			// Clean dashboard
			const removeVisualizations = (dash) => {
				if (dash) {
					for (var i = 0; i < dash.children.length; i++) {
						dash.removeChild(dash.children[i])
					};
				}
			}

			$scope.navClass = function (page) {
				var currentRoute = $location.path().substring(1) || 'Visualize';
				return page === currentRoute ? 'active' : '';
			};

			$scope.loadVisualize = function () {
				removeVisualizations($rootScope.actualdash)
				$scope.showSelected = false;
				$location.url('/Visualize');
			};
			$scope.loadDashboard = function () {
				removeVisualizations($rootScope.actualdash)
				$scope.showSelected = false;
				$location.url('/Dashboard');
			};
			$scope.loadShow = function () {
				removeVisualizations($rootScope.actualdash)
				$scope.showSelected = true;
				$location.url('/Show');
			};
		}

		TabsController.$inject = ['$scope', '$rootScope', '$location', 'esFactory', 'ESService', 'ModalService', 'Notification'];

		return TabsController;

	});
