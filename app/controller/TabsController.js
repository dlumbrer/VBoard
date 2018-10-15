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

			/////////////////////////////////////////////FONDO PANTALLA//////////////////////////////
			$scope.$root.backgrounds = [{ imgprefix: "../../images/backgrounds/skycubemap-", extension: "png" }, { imgprefix: "../../images/backgrounds/dawnmountain-", extension: "png" }, { imgprefix: "../../images/backgrounds/DarkSea-", extension: "png" }, { imgprefix: "../../images/backgrounds/moondust-", extension: "png" }, { imgprefix: "../../images/backgrounds/nebula-", extension: "png" }];
			$scope.$root.switchBackground = function () {
				if (!$scope.$root.idCurrentBackground) {
					$scope.$root.idCurrentBackground = 1
				} else if ($scope.$root.idCurrentBackground === $scope.$root.backgrounds.length) {
					$scope.$root.idCurrentBackground = 1
				} else {
					$scope.$root.idCurrentBackground++
				}

				$scope.$root.loadBackgroundById($scope.$root.idCurrentBackground)
			};
			$scope.$root.loadBackgroundById = (id) => {
				var map = document.querySelector("#skymap");
				map.setAttribute("envmap", $scope.$root.backgrounds[id - 1]);
			}

			///////////////////////////////////////////////////////////////////////////////////////
		}

		TabsController.$inject = ['$scope', '$rootScope', '$location', 'esFactory', 'ESService', 'ModalService', 'Notification'];

		return TabsController;

	});
