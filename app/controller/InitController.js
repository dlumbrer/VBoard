define(
	['node_modules/bodybuilder/browser/bodybuilder.min'],
	function () {
		function InitController($scope, $rootScope, $location, $timeout, esFactory, ESService, ModalService, Notification) {
			angular.element(document).ready(function () {
				$scope.foo = "YEAH!"

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
					if (err.status === 404) {
						console.log("NO HAY INDICE")
						return null; // Esto va a hacer que el body sea null, y entrará en el then
					}
				}).then(function (body) {
					if(!body){
						$scope.foo = "NO HAY INDICE, Creando indice y subiendo mapping..."

						///////////////////////////////////////////////////////////////////////////
						generatorQueries.createVBoardIndex(ESService.client)
						.then(function (body) {
							if (!body) {
								$scope.foo = "An unexpected error appeared"
							}
							$scope.foo = "Mapping de .vboard subido, redirigiendo a /Visualize"
							redirectVisualize();
						})
						///////////////////////////////////////////////////////////////////////////
						
						return null
					}
					$scope.foo = "Todo ha ido correctamente, bienvenido a VBoard";
					//console.log(body)
					redirectVisualize();
					
				});
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////

				function redirectVisualize(){
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
