define(
		function() {
      function DashboardController($scope, esFactory, ESService, ModalService, Notification) {
				angular.element(document).ready(function () {

					var generatorQueries = genES()
					var builderData = builderESDS()
					var bodybuilder = require('node_modules/bodybuilder/browser/bodybuilder.min')

					//////////////////LOAD ALL VIS ALL PANELS//////////////////
					var promise = genES.loadAllVis(ESService.client)
	        promise.then(function (resp) {
	          console.log("Cargadas: ", resp.hits.hits)
	          $scope.loadedvis = resp.hits.hits;
	        })

					//Me traigo las visualizaciones
					var promise = genES.loadAllPanels(ESService.client);
					promise.then(function (resp) {
						console.log("Cargadas: ", resp.hits.hits)
						$scope.loadedpanels = resp.hits.hits;
					})
					////////////////////////////////////////////////

					//////////////////////////////////////AÑADIR VIS A DASHBOARD//////////////////////
					$scope.addVisToDash = function(visall, posx, posy, posz){
						console.log("A AÑADIR", visall);

						vis = visall._source;


						switch (vis.chartType) {
								case "pie":
										var chart = THREEDC.pieChart().data(vis.visobject._data).id(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break
								case "bars":
										var chart = THREEDC.barsChart().data(vis.visobject._data).id(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "line":
										var chart = THREEDC.lineChart().data(vis.visobject._data).id(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "curve":
										var chart = THREEDC.smoothCurveChart().data(vis.visobject._data).id(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "3DBars":
										var chart = THREEDC.TDbarsChart().data(vis.visobject._data).id(visall._id).gridsOn();
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "bubbles":
										var chart = THREEDC.bubbleChart().data(vis.visobject._data).id(visall._id).gridsOn();
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								default:
										console.log("Esta vacío")
										return


						}

					}////////////////////////////////////////////////

					//////////////////////////////////////AÑADIR PANEL A DASHBOARD//////////////////////
					$scope.addPanelToDash = function(paneltoadd, posx, posy, posz){
						console.log("A AÑADIR", paneltoadd);

						var dimension = "[" + paneltoadd._source.dimension + "]"

						var panel = THREEDC.Panel({numberOfRows:parseInt(paneltoadd._source.rows), numberOfColumns:paneltoadd._source.columns}, JSON.parse(dimension), JSON.parse(paneltoadd._source.opacity));

						dash.addPanel(panel, {x:posx, y:posy, z:posz})

						for (var i = 0; i < paneltoadd._source.charts.length; i++) {
							addVisToPanel(panel, paneltoadd._source.charts[i])
						}

					}

					var addVisToPanel = function(panel, visall){
						console.log("Hay que meter esta vis en el panel", visall);

						var rowchart = visall.row;
						var rowcolumn = visall.column;

						var promise = generatorQueries.getVis(ESService.client, visall.id);
						promise.then(function (resp) {
							console.log("Visualiazcion a editar: ", resp.hits.hits[0])
							vis = resp.hits.hits[0]._source;



							switch (vis.chartType) {
									case "pie":
											var chart = THREEDC.pieChart().data(vis.visobject._data).id(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break
									case "bars":
											var chart = THREEDC.barsChart().data(vis.visobject._data).id(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "line":
											var chart = THREEDC.lineChart().data(vis.visobject._data).id(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "curve":
											var chart = THREEDC.smoothCurveChart().data(vis.visobject._data).id(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "3DBars":
											var chart = THREEDC.TDbarsChart().data(vis.visobject._data).id(visall.id).gridsOn();
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "bubbles":
											var chart = THREEDC.bubbleChart().data(vis.visobject._data).id(visall.id).gridsOn();
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									default:
											console.log("Esta vacío")
											return

							}
						})
					}

					////////////////////////////////////////////////

					/////////////////////////////MODAL PARA ELEGIR LA POSICION DE LA VIS O EL PANEL EN EL DASHBOARD/////////////////////////////
					$scope.openAddToDashModal = function(item, isPanel) {


						ModalService.showModal({
								templateUrl: 'positionvispanelmodal.html',
								scope: $scope,
								controller: function($scope, close) {

									$scope.acceptAdd = function(result) {

										if(isPanel){
											$scope.addPanelToDash(item, $scope.x, $scope.y, $scope.z);
										}else{
											$scope.addVisToDash(item, $scope.x, $scope.y, $scope.z);
										}
									}


								}
						}).then(function(modal) {
								modal.element.modal();
								modal.close.then(function(result) {
										console.log("modal cerrado de position")
								});
						});
					};
					///////////////////////////////////////////////////////////////////////////////////////////////////////////


					///////////////////////////////////////////THREEDC/////////////////////////////////////////
					var container = document.getElementById( 'ThreeJSDashboard' );

					var dash = THREEDC.dashBoard(container);



					/////////////////////////////////////////////////////////////////////////////////////

				});
      }

      DashboardController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return DashboardController;

});
