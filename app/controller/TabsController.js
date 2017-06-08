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
					$rootScope.actualdash.removeAllCharts();
					for (var i = 0; i < $rootScope.actualdash.panels.length; i++) {
						$rootScope.actualdash.panels[i].remove()
					}
					$scope.showSelected = true;
					$location.url('/Show');
				};

				$scope.idcurrentbackground = 0;

				$scope.switchBackground = function (){
					if($rootScope.skyBox){
						$rootScope.actualdash.scene.remove($rootScope.skyBox);
					}

					var arrayPrefix = ["dawnmountain-", "DarkSea-", "moondust-", "nebula-", "skycubemap-"]

					if($scope.idcurrentbackground >= arrayPrefix.length){
						$scope.idcurrentbackground = 0;
						$rootScope.prefixActualBackground = "none"
						return;
					}
					var imagePrefix = "../../images/backgrounds/" + arrayPrefix[$scope.idcurrentbackground];
					var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
					var imageSuffix = ".png";
					var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

					var materialArray = [];
					for (var i = 0; i < 6; i++)
							materialArray.push( new THREE.MeshBasicMaterial({
									map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
									side: THREE.BackSide
							}));
					var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
					$rootScope.skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
					$rootScope.actualdash.scene.add( $rootScope.skyBox );
					$rootScope.prefixActualBackground = arrayPrefix[$scope.idcurrentbackground];

					$scope.idcurrentbackground++;
				}


      }

      TabsController.$inject = [ '$scope', '$rootScope', '$location' ,'esFactory', 'ESService', 'ModalService', 'Notification'];

			return TabsController;

});
