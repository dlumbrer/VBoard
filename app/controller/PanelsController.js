define(
		function() {
      function PanelsController($scope, esFactory, ESService, ModalService, Notification) {
				angular.element(document).ready(function () {

					var generatorQueries = genES()
					var builderData = builderESDS()
					var bodybuilder = require('node_modules/bodybuilder/browser/bodybuilder.min')

	        ///////////////////////////VISUALIZACIONES CARGADAS///////////////////////////
	        //Me traigo las visualizaciones
					$scope.editingPanel = true;
	        var promise = genES.loadAllVis(ESService.client)
	        promise.then(function (resp) {
	          console.log("Cargadas: ", resp.hits.hits)
	          $scope.loadedvis = resp.hits.hits;
	        })


					$scope.createNewPanel = function(position, rows, columns, dimension, op){
						if($scope.actualPanel){
							$scope.actualPanel.remove()
						}
						$scope.actualPanel = THREEDC.Panel({numberOfRows:rows, numberOfColumns:columns}, dimension, op);

						dash.addPanel($scope.actualPanel, position)


						//console.log($scope.actualPanel)
						//dash.renderAll()

					}

					//////////////////////////////////////AÑADIR VIS A PANEL//////////////////////
					$scope.addToPanel = function(visall){
						console.log("A AÑADIR", visall);

						vis = visall._source;


						switch (vis.chartType) {
								case "pie":
										var chart = THREEDC.pieChart().data(vis.visobject._data).id(visall._id).addCustomEvents(editVis);
										$scope.actualPanel.addChart(chart, {row:1, column: 1})
										break
								case "bars":
										var chart = THREEDC.barsChart().data(vis.visobject._data).id(visall._id);
										$scope.actualPanel.addChart(chart, {row:1, column: 2})
										break;
								case "line":
										var chart = THREEDC.lineChart().data(vis.visobject._data).id(visall._id);
										$scope.actualPanel.addChart(chart, {row:2, column: 1})
										break;
								case "curve":
										var chart = THREEDC.smoothCurveChart().data(vis.visobject._data).id(visall._id);
										$scope.actualPanel.addChart(chart, {row:2, column: 2})
										break;
								case "3DBars":
										var chart = THREEDC.TDbarsChart().data(vis.visobject._data).id(visall._id).gridsOn();
										$scope.actualPanel.addChart(chart, {row:2, column: 3})
										break;
								case "bubbles":
										var chart = THREEDC.bubbleChart().data(vis.visobject._data).id(visall._id).gridsOn();
										$scope.actualPanel.addChart(chart, {row:3, column: 2})
										break;
								default:
										console.log("Esta vacío")
										return

						}

					}
					/////////////////////////////////////////////////////////////////////////////

					//////////////////////////////////////EDITAR VIS DE PANEL//////////////////////
					var editVis = function(mesh) {
						dash.domEvents.bind(mesh, 'click', function(object3d){
							console.log("llamada a edicion de chart")
							//mesh.parentChart es el chart completo
							console.log("Objeto cargado", mesh.parentChart)
							idtosearch = mesh.parentChart._id
							//console.log(object3d)
							//console.log($scope)

							//Apply para que se apliquen los cambios al $scope
							$scope.$apply(function(){
								$scope.editingPanel = false;
								$scope.editingVis = true;

								var promise = generatorQueries.getVis(ESService.client, idtosearch);
								promise.then(function (resp) {
				          console.log("Visualiazcion a editar: ", resp.hits.hits[0])
									vis = resp.hits.hits[0]._source;
				        })

							})

						});
						console.log($scope.editingPanel)
					}
					/////////////////////////////////////////////////////////////////////////////


					///////////////////////////////////NEW PANEL////////////////////////////////////

					$scope.openNewPanelModal = function() {
						ModalService.showModal({
						    templateUrl: 'newpanelmodal.html',
								scope: $scope,
						    controller: function($scope, close) {

									 $scope.confirmCreate = function(result) {
									 	console.log("NEW PANEL TO CREATE")
										$scope.createNewPanel({x:$scope.positionx, y:$scope.positiony, z:$scope.positionz}, $scope.rows, $scope.columns, JSON.parse($scope.dimension), $scope.opacity);
									 };

									 $scope.cancel = function(result) {
									 	console.log("cancel")
									 };
								}
						}).then(function(modal) {
						    modal.element.modal();
						    modal.close.then(function(result) {
						        console.log("modal cerrado")
						    });
						});
					};
					/////////////////////////////////////////////////////////////////////////////
					///////////////////////////////////SAVE PANEL////////////////////////////////////

					$scope.openSavePanelModal = function() {

						if(!$scope.actualPanel){
							Notification.error("First build a panel")
							return
						}

							ModalService.showModal({
			            templateUrl: 'savepanelmodal.html',
									scope: $scope,
			            controller: function($scope, close) {

										 $scope.save = function(result) {
										 	console.log("Queremos guardar ---- ", $scope.name, $scope.description, $scope.$parent.actualPanel)


											//TODO: Cambiar filas y columnas por nueva versión de adrian
											var arrayChartsToSave = [];
											for (var i = 0; i < $scope.$parent.actualPanel.charts.length; i++) {
												var c = {
													row: $scope.$parent.actualPanel.charts[i].panelPosition.row,
													column: $scope.$parent.actualPanel.charts[i].panelPosition.column,
													id : $scope.$parent.actualPanel.charts[i]._id
												}
												arrayChartsToSave.push(c)
											}

											var positionPanel = "[" + $scope.$parent.actualPanel.coords.x + "," + $scope.$parent.actualPanel.coords.y + "," + $scope.$parent.actualPanel.coords.z + "]";


											var promiseCheck = generatorQueries.checkPanel(ESService.client, $scope.name)
											//ERROR GUARDANDO COMPROBAMOS SI EXISTE
											promiseCheck.then(function(response, error){
												if(error){
													Notification.error("ElasticSearch error")
												}

												//SI NO EXISTE SE CREA DE 0, SI NO HAY QUE PREGUNTAR SI QUIERE SOBREESCRIBIRSE
												if(response.hits.hits.length == 0){
													//Guardo
													var promise = generatorQueries.createPanel(ESService.client, $scope.name, $scope.description, positionPanel, $scope.actualPanel.grid.numberOfRows.toString(), $scope.actualPanel.grid.numberOfColumns.toString(), $scope.actualPanel.dimensions.toString(), $scope.actualPanel.opacity.toString(), arrayChartsToSave);
													promise.then(function(response, error){
														if(error){
															Notification.error("Error creating panel")
															return
														}
														Notification.success("Panel created")
													})
												}else{
													console.log("Modal of confirm");
													//MODAL DE CONFIRMACION
													ModalService.showModal({
									            templateUrl: 'updatepanelmodalconfirm.html',
															scope: $scope,
									            controller: function($scope, close) {

																 $scope.confirmUpdate = function(result) {
																 	console.log("Actualizar ---- ", $scope.name, $scope.description, $scope.$parent.actualPanel)
																	//Guardo
																	var promiseUpdate = generatorQueries.updatePanel(ESService.client, $scope.name, $scope.description, positionPanel, $scope.actualPanel.grid.numberOfRows.toString(), $scope.actualPanel.grid.numberOfColumns.toString(), $scope.actualPanel.dimensions.toString(), $scope.actualPanel.opacity.toString(), arrayChartsToSave);
																	promiseUpdate.then(function(response, error){
																		if(error){
																			Notification.error("Error updating panel")
																			return
																		}
																		Notification.success("Panel updated")
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


					/////////////////////////////LOAD VIS/////////////////////////////////////////
					$scope.openLoadPanelModal = function() {

						/*if(!$scope.indexName){
							Notification.error("First select an Index")
							return
						}*/

						ModalService.showModal({
								templateUrl: 'loadpanelmodal.html',
								scope: $scope,
								controller: function($scope, close) {

									//Me traigo las visualizaciones
									var promise = genES.loadAllPanels(ESService.client);

									promise.then(function (resp) {
										console.log("Cargadas: ", resp.hits.hits)
										$scope.loadedpanels = resp.hits.hits;
									})



								}
						}).then(function(modal) {
								modal.element.modal();
								modal.close.then(function(result) {
										console.log("modal cerrado de carga")
								});
						});
					};
					//////////////////////////////////////////////////////////////////////////////


					///////////////////////////////////////////THREEDC/////////////////////////////////////////
					var container = document.getElementById( 'ThreeJSPanels' );

					var dash = THREEDC.dashBoard(container);

					$scope.createNewPanel({x:100,y:100,z:100},3,3,[500,500],0.6);


					/////////////////////////////////////////////////////////////////////////////////////

				});
      }

      PanelsController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return PanelsController;

});
