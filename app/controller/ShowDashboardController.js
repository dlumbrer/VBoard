define(
	function () {
		function ShowDashboardController($scope, $rootScope, $route, $routeParams, esFactory, ESService, ModalService, Notification) {
			angular.element(document).ready(function () {

				/////////////////Eliminar navbar
				$scope.$parent.navVisible = true;
				$(".contain").css("padding-top", "0px")
				/////////////////
				console.log("ID DEL DASHBOARD A CARGAR: ", $routeParams.name)
				var generatorQueries = genES()
				var builderData = builderESDS()
				var bodybuilder = require('node_modules/bodybuilder/browser/bodybuilder.min')


				//CARGAR Y PINTAR DASHBOARD//////////////////////////////////////////////////////////
				var promise = genES.getDash(ESService.client, $routeParams.name)
				promise.then(function (resp) {
					console.log("Cargado dash: ", resp.hits.hits)
					$scope.actualLoadDashboard = resp.hits.hits[0];

					// Pintar background
					if ($scope.actualLoadDashboard._source.background) {
						$scope.$root.loadBackgroundById($rootScope.actualdash, $scope.actualLoadDashboard._source.background)
					}

					for (var i = 0; i < $scope.actualLoadDashboard._source.charts.length; i++) {
						var promise = genES.getVis(ESService.client, $scope.actualLoadDashboard._source.charts[i].id)
						var actuali = i;
						promise.then(function (resp) {
							console.log("Cargado chart: ", resp.hits.hits[0])
							var chart = resp.hits.hits[0];

							for (var i = 0; i < $scope.actualLoadDashboard._source.charts.length; i++) {
								if ($scope.actualLoadDashboard._source.charts[i].id == chart._id) {
									$scope.addVisToDash(chart, $scope.actualLoadDashboard._source.charts[i].x, $scope.actualLoadDashboard._source.charts[i].y, $scope.actualLoadDashboard._source.charts[i].z, $scope.actualLoadDashboard._source.charts[i].rotx, $scope.actualLoadDashboard._source.charts[i].roty, $scope.actualLoadDashboard._source.charts[i].rotz);
								}
							}

						})
					}
				})

				//////////////////////////////////////AÑADIR VIS A DASHBOARD//////////////////////
				$scope.addVisToDash = function (visall, posx, posy, posz, rotx, roty, rotz) {
					console.log("A AÑADIR", visall);

					vis = visall._source;


					switch (vis.chartType) {
						case "pie":
							var chart = aframedc.pieChart().data(vis.data).depth(1).setId(visall._id);
							dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
							posx += 150;
							break
						case "bars":
							var chart = aframedc.barChart().data(vis.data).setId(visall._id);
							dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
							posx += 150;
							break;
						case "curve":
							var chart = aframedc.smoothCurveChart().data(vis.data).setId(visall._id);
							dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
							posx += 150;
							break;
						case "3DBars":
							var chart = aframedc.barChart3d().data(vis.data).setId(visall._id);
							dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
							posx += 150;
							break;
						case "bubbles":
							var chart = aframedc.bubbleChart().data(vis.data).setId(visall._id);
							dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
							posx += 150;
							break;
						default:
							console.log("Esta vacío")
							return
					}

				}////////////////////////////////////////////////

				///////////////////////////////////////////THREEDC/////////////////////////////////////////
				var container = document.getElementById('AframeDCShow');
				let dash = aframedc.dashboard(container);
				let backgroundEntity = document.createElement("a-entity")
				backgroundEntity.setAttribute("id", "skymap")
				dash.appendChild(backgroundEntity)
				$scope.actualDashboard = dash;
				$rootScope.actualdash = dash;
				/////////////////////////////////////////////////////////////////////////////////////
			});
		}

		ShowDashboardController.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'esFactory', 'ESService', 'ModalService', 'Notification'];

		return ShowDashboardController;

	});
