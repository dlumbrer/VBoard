define(
	['node_modules/bodybuilder/browser/bodybuilder.min'],
	function () {
		function InitController($scope, $rootScope, $location, $timeout, esFactory, ESService, ModalService, Notification) {
			angular.element(document).ready(function () {
				$scope.infoMessage = "Making some configuration..."

				/////////////////Eliminar navbar
				$scope.$parent.navVisible = true;
				$(".contain").css("padding-top", "0px")
				/////////////////

				var bodybuilder = require('node_modules/bodybuilder/browser/bodybuilder.min')

				//////////////////////////////////PRIMERO VER SI ESTÁ EL INDICE////////////////////////////////
				var generatorQueries = genES()
				var builderData = builderESDS()

				generatorQueries.checkVBoardIndex(ESService.client)
					.catch(function (err) {
						// Si hay error
						// recover here if err is 404
						console.log(err)
						if (err.status === 404) {
							console.log("No index, attempting to create it...")
							return null; // Esto va a hacer que el body sea null, y entrará en el then
						} else if (err.status == -1) {
							// No está conectado ES, problema con ES
							console.log("ERROR: " + err)
							return -1;
						}
					}).then(function (body) {
						if (!body) {
							$scope.infoMessage = "There is no vboard index, creating it..."

							///////////////////////////////////////////////////////////////////////////
							generatorQueries.createVBoardIndex(ESService.client)
								.then(function (body) {
									if (!body) {
										$scope.infoMessage = "ERROR: An unexpected error appeared"
									}
									$scope.infoMessage = "Index and mapping of VBoard created, welcome!"
									redirectVisualize();
								})
							///////////////////////////////////////////////////////////////////////////

							return null
						}
						// No está conectado ES, problema con ES
						if (body == -1) {
							$scope.infoMessage = "ERROR: Impossible connect to ElasticSearch";
							return null
						}
						$scope.infoMessage = "Everything is right, welcome to VBoard!";
						//console.log(body)
						redirectVisualize();

					});
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////

				function redirectVisualize() {
					// 3 Segundos y redirección
					$timeout(function () {
						$location.path('/Visualize').replace();
					}, 3000);
				}


			})
		}



		InitController.$inject = ['$scope', '$rootScope', '$location', '$timeout', 'esFactory', 'ESService', 'ModalService', 'Notification'];

		return InitController;

	});
