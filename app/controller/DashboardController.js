define(
	function () {
		function DashboardController($scope, $rootScope, esFactory, ESService, ModalService, Notification) {
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
				////////////////////////////////////////////////

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


				/////////////////////////////MODAL PARA ELEGIR LA POSICION DE LA VIS O EL EN EL DASHBOARD/////////////////////////////
				$scope.openAddToDashModal = function (item, isPanel) {


					ModalService.showModal({
						templateUrl: 'positionvispanelmodal.html',
						scope: $scope,
						controller: function ($scope, close) {

							$scope.acceptAdd = function (result) {
								$scope.addVisToDash(item, $scope.x, $scope.y, $scope.z, $scope.rotx, $scope.roty, $scope.rotz);
							}


						}
					}).then(function (modal) {
						modal.element.modal();
						modal.close.then(function (result) {
							console.log("modal cerrado de position")
						});
					});
				};
				///////////////////////////////////////////////////////////////////////////////////////////////////////////


				///////////////////////////////////SAVE DASHBOARD////////////////////////////////////

				$scope.openSaveDashboardModal = function () {

					if (!$scope.actualDashboard) {
						Notification.error("First build a Dashboard")
						return
					}

					ModalService.showModal({
						templateUrl: 'savedashboardmodal.html',
						scope: $scope,
						controller: function ($scope, close) {

							$scope.save = function (result) {
								console.log("Queremos guardar ---- ", $scope.name, $scope.description, $scope.$parent.actualDashboard)

								var arrayChartsToSave = [];
								for (var i = 0; i < $scope.$parent.actualDashboard.children.length; i++) {
									if ($scope.$parent.actualDashboard.children[i].id !== "skymap") {
										var c = {
											x: $scope.$parent.actualDashboard.children[i].components.position.attrValue.x,
											y: $scope.$parent.actualDashboard.children[i].components.position.attrValue.y,
											z: $scope.$parent.actualDashboard.children[i].components.position.attrValue.z,
											rotx: $scope.$parent.actualDashboard.children[i].components.rotation.attrValue.x,
											roty: $scope.$parent.actualDashboard.children[i].components.rotation.attrValue.y,
											rotz: $scope.$parent.actualDashboard.children[i].components.rotation.attrValue.z,
											id: $scope.$parent.actualDashboard.children[i]._id
										}
										arrayChartsToSave.push(c)
									}
								}


								var promiseCheck = generatorQueries.checkDashboard(ESService.client, $scope.name)
								//ERROR GUARDANDO COMPROBAMOS SI EXISTE
								promiseCheck.then(function (response, error) {
									if (error) {
										Notification.error("ElasticSearch error")
									}

									//SI NO EXISTE SE CREA DE 0, SI NO HAY QUE PREGUNTAR SI QUIERE SOBREESCRIBIRSE
									if (response.hits.hits.length == 0) {
										//Guardo
										var promise = generatorQueries.createDashboard(ESService.client, $scope.name, $scope.description, arrayChartsToSave, [], $rootScope.idCurrentBackground);
										promise.then(function (response, error) {
											if (error) {
												Notification.error("Error creating dash")
												return
											}
											Notification.success("Dashboard created")
										})
									} else {
										console.log("Modal of confirm");
										//MODAL DE CONFIRMACION
										ModalService.showModal({
											templateUrl: 'updatedashboardmodalconfirm.html',
											scope: $scope,
											controller: function ($scope, close) {

												$scope.confirmUpdate = function (result) {
													console.log("Actualizar ---- ", $scope.name, $scope.description, $scope.$parent.actualDashboard)
													//Guardo
													var promiseUpdate = generatorQueries.updateDashboard(ESService.client, $scope.name, $scope.description, arrayChartsToSave, [], $rootScope.idCurrentBackground);
													promiseUpdate.then(function (response, error) {
														if (error) {
															Notification.error("Error updating dash")
															return
														}
														Notification.success("Dashboard updated")
													})
												};

												$scope.cancelUpdate = function (result) {
													console.log("cancel update")
												};

											}
										}).then(function (modal) {
											modal.element.modal();
											modal.close.then(function (result) {
												console.log("modal cerrado")
											});
										});
										///////////////
									}
								})

							};

							$scope.cancel = function (result) {
								console.log("cancel")
							};
							///////////////////////////////////////////////////////////////////////7
						}
					}).then(function (modal) {
						modal.element.modal();
						modal.close.then(function (result) {
							console.log("modal cerrado")
						});
					});
				};

				///////////////////////////////////LOAD DASHBOARD////////////////////////////////////

				$scope.openLoadDashboardModal = function () {

					ModalService.showModal({
						templateUrl: 'loaddashmodal.html',
						scope: $scope,
						controller: function ($scope, close) {

							//Me traigo los dashboards
							var promise = genES.loadAllDashboards(ESService.client);

							promise.then(function (resp) {
								console.log("Dashboards cargados: ", resp.hits.hits)
								$scope.loadeddashboards = resp.hits.hits;
							})



						}
					}).then(function (modal) {
						modal.element.modal();
						modal.close.then(function (result) {
							console.log("modal cerrado de carga")
						});
					});
				};

				$scope.loadDash = function (dashtoadd) {
					console.log("cargar dash:", dashtoadd);

					// Remove current dashboard (removing just the children)
					for (var i = 0; i < $rootScope.actualdash.children.length; i++) {
						if ($rootScope.actualdash.children[i].id !== "skymap") {
							$rootScope.actualdash.removeChild($rootScope.actualdash.children[i])
						}
					};

					// Pintar background
					if (dashtoadd._source.background) {
						$scope.$root.loadBackgroundById($rootScope.actualdash, dashtoadd._source.background)
					}

					//Pintar visualizaciones
					for (var i = 0; i < dashtoadd._source.charts.length; i++) {
						var promise = genES.getVis(ESService.client, dashtoadd._source.charts[i].id)
						var actuali = i;
						promise.then(function (resp) {
							console.log("Cargado chart: ", resp.hits.hits[0])
							var chart = resp.hits.hits[0];

							for (var i = 0; i < dashtoadd._source.charts.length; i++) {
								if (dashtoadd._source.charts[i].id == chart._id) {
									$scope.addVisToDash(chart, dashtoadd._source.charts[i].x, dashtoadd._source.charts[i].y, dashtoadd._source.charts[i].z, dashtoadd._source.charts[i].rotx, dashtoadd._source.charts[i].roty, dashtoadd._source.charts[i].rotz);
								}
							}

						})
					}

				}

				///////////////////////////////////////////AFRAMEDC/////////////////////////////////////////
				var scenediv = document.getElementById("Aframediv");
				let dash = aframedc.dashboard(scenediv);
				let backgroundEntity = document.createElement("a-entity")
				backgroundEntity.setAttribute("id", "skymap")
				dash.appendChild(backgroundEntity)
				$scope.actualDashboard = dash;
				$rootScope.actualdash = dash;
				/////////////////////////////////////////////////////////////////////////////////////
			});
		}

		DashboardController.$inject = ['$scope', '$rootScope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

		return DashboardController;

	});
