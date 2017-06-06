define(
		function() {
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

						//Fondo///////////////
						if($scope.actualLoadDashboard._source.background && $scope.actualLoadDashboard._source.background != "none"){
							var imagePrefix = "../../images/backgrounds/" + $scope.actualLoadDashboard._source.background;
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
							var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
							$scope.actualDashboard.scene.add( skyBox );
						}
						///////////////


						for (var i = 0; i < $scope.actualLoadDashboard._source.panels.length; i++) {
							var promise = genES.getPanel(ESService.client, $scope.actualLoadDashboard._source.panels[i].id)
			        promise.then(function (resp, i) {
			          console.log("Cargado panel: ", resp.hits.hits[0])
			          var panel = resp.hits.hits[0];
								for (var i = 0; i < $scope.actualLoadDashboard._source.panels.length; i++) {
									if($scope.actualLoadDashboard._source.panels[i].id == panel._id){
										$scope.addPanelToDash(panel, $scope.actualLoadDashboard._source.panels[i].x, $scope.actualLoadDashboard._source.panels[i].y, $scope.actualLoadDashboard._source.panels[i].z);
									}
								}

			        })
						}

						for (var i = 0; i < $scope.actualLoadDashboard._source.charts.length; i++) {
							var promise = genES.getVis(ESService.client, $scope.actualLoadDashboard._source.charts[i].id)
							var actuali = i;
			        promise.then(function (resp) {
			          console.log("Cargado chart: ", resp.hits.hits[0])
			          var chart = resp.hits.hits[0];

								for (var i = 0; i < $scope.actualLoadDashboard._source.charts.length; i++) {
									if($scope.actualLoadDashboard._source.charts[i].id == chart._id){
										$scope.addVisToDash(chart, $scope.actualLoadDashboard._source.charts[i].x, $scope.actualLoadDashboard._source.charts[i].y, $scope.actualLoadDashboard._source.charts[i].z);
									}
								}

			        })
						}
	        })



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
											var chart = THREEDC.pieChart().data(vis.data).setId(visall.id).radius(visall.width);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break
									case "bars":
											var chart = THREEDC.barsChart().data(vis.data).setId(visall.id).width(visall.width).height(visall.height);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "line":
											var chart = THREEDC.lineChart().data(vis.data).setId(visall.id).width(visall.width).height(visall.height);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "curve":
											var chart = THREEDC.smoothCurveChart().data(vis.data).setId(visall.id).width(visall.width).height(visall.height);
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "3DBars":
											var chart = THREEDC.TDbarsChart().data(vis.data).setId(visall.id).width(visall.width).height(visall.height).depth(visall.depth).gridsOn();
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									case "bubbles":
											var chart = THREEDC.bubbleChart().data(vis.data).setId(visall.id).width(visall.width).height(visall.height).depth(visall.depth).gridsOn();
											panel.addChart(chart, {row:rowchart, column: rowcolumn})
											break;
									default:
											console.log("Esta vacío")
											return

							}
						})
					}

					////////////////////////////////////////////////

					///////////////////////////////////////////THREEDC/////////////////////////////////////////
					var container = document.getElementById( 'ThreeJSShow' );

					var dash = THREEDC.dashBoard(container);
					$scope.actualDashboard = dash;



					/////////////////////////////////////////////////////////////////////////////////////

				});
      }

      ShowDashboardController.$inject = [ '$scope', '$rootScope', '$route', '$routeParams', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return ShowDashboardController;

});
