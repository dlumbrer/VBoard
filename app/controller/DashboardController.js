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
										var chart = THREEDC.pieChart().data(vis.data).setId(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break
								case "bars":
										var chart = THREEDC.barsChart().data(vis.data).setId(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "line":
										var chart = THREEDC.lineChart().data(vis.data).setId(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "curve":
										var chart = THREEDC.smoothCurveChart().data(vis.data).setId(visall._id);
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "3DBars":
										var chart = THREEDC.TDbarsChart().data(vis.data).setId(visall._id).gridsOn();
										dash.addChart(chart, {x:posx, y:posy, z:posz})
										posx += 150;
										break;
								case "bubbles":
										var chart = THREEDC.bubbleChart().data(vis.data).setId(visall._id).gridsOn();
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

						var panel = THREEDC.Panel({numberOfRows:parseInt(paneltoadd._source.rows), numberOfColumns:paneltoadd._source.columns}, JSON.parse(dimension), JSON.parse(paneltoadd._source.opacity)).setId(paneltoadd._id);;

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
											var chart = THREEDC.pieChart().data(vis.data).setId(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break
									case "bars":
											var chart = THREEDC.barsChart().data(vis.data).setId(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "line":
											var chart = THREEDC.lineChart().data(vis.data).setId(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "curve":
											var chart = THREEDC.smoothCurveChart().data(vis.data).setId(visall.id);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "3DBars":
											var chart = THREEDC.TDbarsChart().data(vis.data).setId(visall.id).gridsOn();
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "bubbles":
											var chart = THREEDC.bubbleChart().data(vis.data).setId(visall.id).gridsOn();
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


					///////////////////////////////////SAVE PANEL////////////////////////////////////

					$scope.openSaveDashboardModal = function() {

						if(!$scope.actualDashboard){
							Notification.error("First build a Dashboard")
							return
						}

							ModalService.showModal({
			            templateUrl: 'savedashboardmodal.html',
									scope: $scope,
			            controller: function($scope, close) {

										 $scope.save = function(result) {
										 	console.log("Queremos guardar ---- ", $scope.name, $scope.description, $scope.$parent.actualDashboard)


											var arrayChartsToSave = [];
											var arrayPanelsToSave = [];

											for (var i = 0; i < $scope.$parent.actualDashboard.panels.length; i++) {
												var c = {
													x: $scope.$parent.actualDashboard.panels[i].coords.x,
													y: $scope.$parent.actualDashboard.panels[i].coords.y,
													z: $scope.$parent.actualDashboard.panels[i].coords.z,
													id : $scope.$parent.actualDashboard.panels[i]._id
												}
												arrayPanelsToSave.push(c)
											}

											for (var i = 0; i < $scope.$parent.actualDashboard.charts.length; i++) {
												//Si no esta en panel
												if(!$scope.$parent.actualDashboard.charts[i].panel){
													var c = {
														x: $scope.$parent.actualDashboard.charts[i].coords.x,
														y: $scope.$parent.actualDashboard.charts[i].coords.y,
														z: $scope.$parent.actualDashboard.charts[i].coords.z,
														id : $scope.$parent.actualDashboard.charts[i]._id
													}
													arrayChartsToSave.push(c)
												}

											}



											var promiseCheck = generatorQueries.checkDashboard(ESService.client, $scope.name)
											//ERROR GUARDANDO COMPROBAMOS SI EXISTE
											promiseCheck.then(function(response, error){
												if(error){
													Notification.error("ElasticSearch error")
												}

												//SI NO EXISTE SE CREA DE 0, SI NO HAY QUE PREGUNTAR SI QUIERE SOBREESCRIBIRSE
												if(response.hits.hits.length == 0){
													//Guardo
													var promise = generatorQueries.createDashboard(ESService.client, $scope.name, $scope.description, arrayChartsToSave, arrayPanelsToSave);
													promise.then(function(response, error){
														if(error){
															Notification.error("Error creating dash")
															return
														}
														Notification.success("Dashboard created")
													})
												}else{
													console.log("Modal of confirm");
													//MODAL DE CONFIRMACION
													ModalService.showModal({
									            templateUrl: 'updatedashboardmodalconfirm.html',
															scope: $scope,
									            controller: function($scope, close) {

																 $scope.confirmUpdate = function(result) {
																 	console.log("Actualizar ---- ", $scope.name, $scope.description, $scope.$parent.actualDashboard)
																	//Guardo
																	var promiseUpdate = generatorQueries.updateDashboard(ESService.client, $scope.name, $scope.description, arrayChartsToSave, arrayPanelsToSave);
																	promiseUpdate.then(function(response, error){
																		if(error){
																			Notification.error("Error updating dash")
																			return
																		}
																		Notification.success("Dashboard updated")
																	})
																 };

																 $scope.cancelUpdate = function(result) {
																 	console.log("cancel update")
																 };

															}
									        }).then(function(modal) {
									            modal.element.modal();
									            modal.close.then(function(result) {
									                console.log("modal cerrado")
									            });
									        });
													///////////////
												}
											})

										 };

										 $scope.cancel = function(result) {
										 	console.log("cancel")
										 };
										 ///////////////////////////////////////////////////////////////////////7
									}
			        }).then(function(modal) {
			            modal.element.modal();
			            modal.close.then(function(result) {
			                console.log("modal cerrado")
			            });
			        });
					};

					///////////////////////////////////////////THREEDC/////////////////////////////////////////
					var container = document.getElementById( 'ThreeJSDashboard' );

					var dash = THREEDC.dashBoard(container);
					$scope.actualDashboard = dash;



					/////////////////////////////////////////////////////////////////////////////////////

				});
      }

      DashboardController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return DashboardController;

});
