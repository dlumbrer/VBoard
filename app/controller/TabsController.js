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
			$scope.$root.backgrounds = ["default", "contact", "egypt", "checkerboard", "forest", "goaland", "yavapai", "goldmine", "threetowers", "poison", "arches", "tron", "japan", "dream", "volcano", "starry", "osiris"];
			$scope.$root.switchBackground = function () {
				if (!$scope.$root.idCurrentBackground) {
					$scope.$root.idCurrentBackground = 1
				} else if ($scope.$root.idCurrentBackground === $scope.$root.backgrounds.length) {
					$scope.$root.idCurrentBackground = 1
				} else {
					$scope.$root.idCurrentBackground++
				}

				$scope.$root.loadBackgroundById($rootScope.actualdash, $scope.$root.idCurrentBackground)
			};
			$scope.$root.loadBackgroundById = (dash, id) => {
				$scope.$root.idCurrentBackground = id
				$("#skymap").remove();
				let backgroundEntity = document.createElement("a-entity")
				backgroundEntity.setAttribute("id", "skymap")
				backgroundEntity.setAttribute("visible", {})
				backgroundEntity.setAttribute("environment", "preset:" + $scope.$root.backgrounds[id - 1] + ";");
				dash.appendChild(backgroundEntity)


			}

			///////////////////////////////////////////////////////////////////////////////////////
		}

		TabsController.$inject = ['$scope', '$rootScope', '$location', 'esFactory', 'ESService', 'ModalService', 'Notification'];

		return TabsController;

	});
