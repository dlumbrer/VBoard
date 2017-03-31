define(
		['node_modules/bodybuilder/browser/bodybuilder.min'],
		function() {
      function VisualizeController($scope, esFactory, ESService, ModalService, Notification) {
				angular.element(document).ready(function () {
        $scope.foo = "YEAH!"

				var bodybuilder = require('node_modules/bodybuilder/browser/bodybuilder.min')

        //////////////////////////////////PRIMERO OBTENER INDICES////////////////////////////////
				var generatorQueries = genES({})
				var builderData = builderESDS({})
				$scope.typeName = "items";

        ESService.client.cat.indices({
          h: ['index', 'docs.count']
        }).then(function (body) {
          let lines = body.split('\n');
          let indices = lines.map(function (line) {
            let row = line.split(' ');
            return {name: row[0], count: row[1]};
          });
          indices.pop(); //the last line is empty by default
          $scope.indexes = indices;
          console.log("INDICES", indices)
        }, function (err) {
		        return "ERROR"
		        console.trace(err.message);
		    });
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////


        /////////////////////////////SHOW MAPPING OF THE INDEX SELECTED IF YOU WANT////////////////////////////
        $scope.searchMappingFromIndex = function(){
          $scope.showMapping = !$scope.showMapping;
					if($scope.showMapping){
	          $scope.indexName = $("#indexesList").val();
	          ESService.client.indices.getMapping({index: $scope.indexName}, function(error, resp) {
	            if (error) {
	                console.log(error);
	            } else {
	                console.log(resp);
	                $scope.mapping = JSON.stringify(resp, undefined, 2);
	            }
	          });
					}
        }
        ///////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////////TRAER MAPPING PARA PODER ELEGIR LUEGO LOS CAMPO SEGUN LA METRICA/BUCKET///////////////////
        $scope.typeFromIndex = function(){
          $scope.showTypeForm = true;

          $scope.indexName = $("#indexesList").val();
          ESService.client.indices.getMapping({index: $scope.indexName}, function(error, resp) {
            if (error) {
                console.log(error);
            } else {
                //console.log(resp);
                $scope.mapping = resp;
                $scope.types = Object.keys($scope.mapping[$scope.indexName].mappings);
                console.log("MAPPING", $scope.mapping[$scope.indexName].mappings);
            }
          });
        }
        //////////////////////////////////////////////////////////////////////

        /////////////////////////////////////Una vez con el indice y el tipo podemos buscar metricas y buckets///////////////

        $scope.showMetricsBuckets = function(){
					if($scope.visType){
	          $scope.showMetricBucketsForm = true;
	          //$scope.visType = $("#typesList").val();
						$scope.typeName = "items";

					}else{
						Notification.error('First select chart type');
					}
        }
        $scope.hideMetricsBucketsForm = function(){
          $scope.showMetricBucketsForm = false;
        }

        ///////////////////////////////////////////////////////////////////////

				////////////////////CUANDO SE CAMBIA DE TIPO DE GRAFICA////////////////
				$scope.changeTypeVis = function(){
					$scope.showMetricBucketsForm = false;
					$scope.metricList = {}
					$scope.bucketList = {}
					$scope.metricsSelected = []
					$scope.bucketsSelected = []
					builderData.reset()
				}
				///////////////////////////////////////////////////////////////////////

				/////////////////////////////////////////////////// MOSTRAR BOTON DE ADD METRIC/BUCKET DEPENDIENDO DEL TIPO DE VISUALIZACIÓN QUE SE HAYA ELEGDO//////////
				$scope.showAddMetricVisType = function(){

					switch ($scope.visType) {
							case "pie":
							case "bars":
							case "line":
							case "curve":
									return false;
							case "3DBars":
									return false;
							case "bubbles":
										return true;
							default:
									return

					}

					return true;

				}

				$scope.showAddSubBucketVisType = function(){

					switch ($scope.visType) {
							case "pie":
							case "bars":
							case "line":
							case "curve":
									return false;
							case "3DBars":
										return true;
							case "bubbles":
										return true;
							default:
									return

					}
					return true;

				}

				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				/////////////////////////////////////////////////MOSTRAR CAMPOS A ELECCION SGUN EL TIPO DE METRICA/BUCKET////////////////////////////////////////////////7
				$scope.showFieldsOfMetricType = function(metricType, index){
					if(!$scope.fieldsMetric){
						$scope.fieldsMetric = []
					}

					switch (metricType) {
							case "avg":
							case "sum":
							case "extended_stats":
							case "median":
									$scope.fieldsMetric[index] = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,i) {
											if(allFields[key].type == "long"){
												$scope.fieldsMetric[index].push(key)
											}
									});
									break;
							case "max":
							case "min":
									$scope.fieldsMetric[index] = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,i) {
											if(allFields[key].type == "long" || allFields[key].type == "date"){
												$scope.fieldsMetric[index].push(key)
											}
									});
									break;
							case "cardinality":
									$scope.fieldsMetric[index] = Object.keys($scope.mapping[$scope.indexName].mappings[$scope.typeName].properties);
									break;
					}
				}
				$scope.showFieldsOfTypeAggregation = function(typeBucket, ind){
					if(!$scope.fields){
						$scope.fields = []
					}

					switch (typeBucket) {
							case "one":
							case "terms":
									//$scope.fields = Object.keys($scope.mapping[$scope.indexName].mappings[$scope.typeName].properties);
									$scope.fields[ind] = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,index) {
											if(allFields[key].type == "text"){
												$scope.fields[ind].push(key + ".keyword")
											}else{
												$scope.fields[ind].push(key)
											}
									});
									break;
									break;
							case "date_histogram":
									$scope.fields[ind] = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,index) {
											if(allFields[key].type == "date"){
												$scope.fields[ind].push(key)
											}
									});
									break;
							case "histogram":
									$scope.fields[ind] = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,index) {
											if(allFields[key].type == "long"){
												$scope.fields[ind].push(key)
											}
									});
									break;
					}
				}
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////

				/////////////////////////////////////////////CUANDO SE PULSA EN ADD METRIC/BUCKET////////////////////////////////////////////////////////////////
				$scope.addMetricForm = function(metricSelected, ind){
					var options = {}
					switch (metricSelected) {
							case "count":
									builderData.addMetric(metricSelected);
									break;
							case "avg":
							case "sum":
							case "max":
							case "min":
							case "extended_stats":
							case "carinality":
									var fieldSelected = $("#fieldMetricList" + ind).val();
									builderData.addMetric(metricSelected, fieldSelected);
									break;
							case "median":
									var fieldSelected = $("#fieldMetricList" + ind).val();
									options = {"percents": ["50"]}
									builderData.addMetric("percentiles", fieldSelected, options);
									break;
							default:
									Notification.error('Impossible to add an empty metric');
									console.log("metrica vacía")
									return
					}

					$scope.metricsSelected = builderData.metrics;
        }

				$scope.addSubbucketForm = function(typeBucket, ind){
					$scope.fieldBucketSelected = $("#fieldBucketsList" + ind).val();

					var options = {}
					switch (typeBucket) {
							case "terms":
									var type = "terms";
									$scope.fieldBucketSelected = $scope.fieldBucketSelected;
									options = {"size": $("#sizeValue"  + ind).val()}
									break;
							case "one":
									var type = "terms";
									$scope.fieldBucketSelected = $scope.fieldBucketSelected;
									options = {"size": "1"}
									break;
							case "date_histogram":
									var type = "date_histogram";
									options = {"interval": $("#intervalDateHistogram"  + ind).val()}
									break;
							case "histogram":
									var type = "histogram";
									options = {"interval": $("#intervalHistogram"  + ind).val()}
									break;
							default:
									Notification.error('Impossible to add an empty bucket');
									console.log("bucket vacío")
									return

					}


          builderData.addBucket(type, $scope.fieldBucketSelected, options)
					//console.log(builderData)
					$scope.bucketsSelected = builderData.buckets;
        }
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////


				///////////////////////////////////////////////////CUANDO SE PULSA EN PLAY//////////////////////////////////////////////////////////
        $scope.showData = function(){
					//Añadir lo que se ha quedado marcado
					if(!($scope.metricList && $scope.bucketList)){
						Notification.error('Error on Select Data');
						return;
					}
					Object.keys($scope.metricList).forEach(function(key) {
							$scope.addMetricForm($scope.metricList[key], key)
					});
					Object.keys($scope.bucketList).forEach(function(i) {
							$scope.addSubbucketForm($scope.bucketList[i], i)
					});

					$scope.showDataNowBuilt();

				}

				$scope.showDataNowBuilt = function(){
					var statements = builderData.buildDataStructure().getDataStructure()

					var promiseSearch = generatorQueries.buildBodybuilderObject(statements, bodybuilder).buildQuery().executeSearch(ESService.client, $scope.indexName)
					//PROMESA
					promiseSearch.then(function (resp) {
						$scope.hits = JSON.stringify(resp.hits, undefined, 2);
						$scope.aggregationsToShow = JSON.stringify(resp.aggregations, undefined, 2);
						$scope.aggregations = resp.aggregations;
						console.log("Respuesta (Agregaciones)", $scope.aggregations)

						//Resetear visualizaciones
						/*if(dash.allCharts[0]){
							dash.allCharts[0].remove()
						}*/
						dash.removeAll()

						switch ($scope.visType) {
								case "pie":
								case "bars":
								case "line":
								case "curve":
										$scope.build2D($scope.visType);
										break;
								case "3DBars":
										$scope.buildTDBarsChart();
										break;
								case "bubbles":
										$scope.buildBubblesChart();
										break;
								default:
										console.log("Esta vacío")
										return

						}


						//resetear datos
						//builderData.buckets = [];
						//builderData.metrics = [];
						builderData.reset()
						//$scope.bucketsSelected = builderData.buckets;
						//$scope.bucketsSelected = builderData.metrics;

			    }, function (err) {
			        console.trace(err.message);
			    });

					//$scope.exexcuteSearch(bodyQuery);

        };
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////

				///////////////////////////////////////////////CARGA DE VISUALIZACIONES Y SUS DATOS SELECCIONADOS////////////////////////////////////////////
				$scope.loadVis = function(vis) {
					console.log("A CARGAR", vis);
					//Abro forms rellenos
					$scope.showTypeForm = true;
					$scope.showMetricBucketsForm = true;

					if(!$scope.metricList){
						$scope.metricList = {}
					}
					for (var i = 0; i < vis.metricsSelected.length; i++) {
						$scope.metricList[i] = vis.metricsSelected[i].aggregationType;
						$scope.showFieldsOfMetricType($scope.metricList[i], i)
					}

					if(!$scope.bucketList){
						$scope.bucketList = {}
					}
					for (var i = 0; i < vis.bucketsSelected.length; i++) {
						$scope.bucketList[i] = vis.bucketsSelected[i].aggregationType;
						$scope.showFieldsOfTypeAggregation($scope.bucketList[i], i)
					}

					//Cargo los datos con los que he guardado la visualizacion
					$scope.visType = vis.chartType;
					$scope.metricsSelected = vis.metricsSelected
					$scope.bucketsSelected = vis.bucketsSelected
					builderData.metrics = vis.metricsSelected
					builderData.buckets = vis.bucketsSelected


					//La muestro
					$scope.showDataNowBuilt();
					//dash.removeAll();
					//visobject.render();
				}
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////FUNCIONES DE THREEDC - CONSTRUCCIÓN DE CHARTS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				z = 0;
				$scope.build2D = function(visType){
					var data = $scope.aggregations['agg_' + $scope.bucketsSelected[0].aggregationType + '_' + $scope.bucketsSelected[0].aggregationField].buckets.map(function(bucket) {
						if($scope.metricsSelected.length > 0 && $scope.metricsSelected[0].aggregationType != "count"){
							var value = bucket['agg_' + $scope.metricsSelected[0].aggregationType + "_" + $scope.metricsSelected[0].aggregationField].value;
						}else{
							var value = bucket.doc_count;
						}

						return {
							key: bucket.key,
							value: value
						};
				 });


				 switch (visType) {
						 case "pie":
							 chart=dash.pieChart([100,100,z])
							 chart.gridsOn();
							 break;
						 case "bars":
							 chart=dash.barsChart([100,100,z])
							 chart.gridsOn();
							 break;
						 case "line":
							 chart=dash.lineChart([100,100,z])
							 chart.gridsOn();
							 break;
						 case "curve":
							 chart=dash.smoothCurveChart([100,100,z])
							 chart.gridsOn();
							 break;
				 }

				 chart.data(data)

				 ////////////GUARDAR LA VISUALIACION EN EL SCOPE
				 $scope.actualVis = {
					 chartType: visType,
					 chartObject: $.extend(true, {}, chart),
					 bucketsSelected : $scope.bucketsSelected,
					 metricsSelected : $scope.metricsSelected
				 }
				 //$scope.actualVis = $.extend(true, {}, chart);
				 console.log("SCOPE CON LA VISUALIZACIÓN", $scope)

				 for (var i = 0; i < dash.allCharts.length; i++) {
				 		dash.allCharts[i].reBuild()
				 }
				 //pie.render();
			 }

			 $scope.buildTDBarsChart = function(){
				 //Comprobar errores
				 if($scope.bucketsSelected.length < 2){
					 Notification.error("Is required to select 2 buckets")
					 return
				 }


				 var data = [];
				 $scope.aggregations['agg_' + $scope.bucketsSelected[0].aggregationType + '_' + $scope.bucketsSelected[0].aggregationField].buckets.map(function(bucketx) {

						var bucketsy = bucketx['agg_' + $scope.bucketsSelected[1].aggregationType + '_' + $scope.bucketsSelected[1].aggregationField].buckets;

						bucketsy.map(function(buckety){
							if($scope.metricsSelected.length > 0 && $scope.metricsSelected[0].aggregationType != "count"){
								var value = buckety['agg_' + $scope.metricsSelected[0].aggregationType + "_" + $scope.metricsSelected[0].aggregationField].value;
							}else{
								var value = buckety.doc_count;
							}
							data.push({key1:bucketx.key, key2:buckety.key, value: value})
						})

				});

				data = getOrderedDataTD(data);

				bars=dash.TDbarsChart([100,100,z])
				bars.data(data);
				bars.width(300);
				bars.height(400);
				bars.depth(500);
				bars.gridsOn();

				////////////GUARDAR LA VISUALIACION EN EL SCOPE
				$scope.actualVis = {
					chartType: "3DBars",
					chartObject: $.extend(true, {}, bars),
					bucketsSelected : $scope.bucketsSelected,
					metricsSelected : $scope.metricsSelected
				}
				//$scope.actualVis = $.extend(true, {}, bars);
				console.log("SCOPE CON LA VISUALIZACIÓN", $scope)

				for (var i = 0; i < dash.allCharts.length; i++) {
					 dash.allCharts[i].reBuild()
				}
				//bars.render();
			}

			$scope.buildBubblesChart = function(){
				if($scope.bucketsSelected.length < 2 || $scope.metricsSelected.length < 2){
					Notification.error("Is required to select 2 buckets and 2 metrics")
					return
				}

					 var data = [];
					 $scope.aggregations['agg_' + $scope.bucketsSelected[0].aggregationType + '_' + $scope.bucketsSelected[0].aggregationField].buckets.map(function(bucketx) {

							var bucketsy = bucketx['agg_' + $scope.bucketsSelected[1].aggregationType + '_' + $scope.bucketsSelected[1].aggregationField].buckets;

							bucketsy.map(function(buckety){
								//HAY QUE EVITAR LOS COUNT
								if($scope.metricsSelected.length == 2){
									if($scope.metricsSelected[0].aggregationType != "count"){
										var value1 = buckety['agg_' + $scope.metricsSelected[0].aggregationType + "_" + $scope.metricsSelected[0].aggregationField].value;
									}else{
										var value1 = buckety.doc_count;
									}
									if($scope.metricsSelected[1].aggregationType != "count"){
										var value2 = buckety['agg_' + $scope.metricsSelected[1].aggregationType + "_" + $scope.metricsSelected[1].aggregationField].value;
									}else{
										var value2 = buckety.doc_count;
									}
								}else{
									var value1 = buckety.doc_count;
									var value2 = buckety.doc_count;
								}
								data.push({key1:bucketx.key, key2:buckety.key, value: value1, value2: value2})
							})

					});

					data = getOrderedDataBubbles(data);

					bars=dash.bubbleChart([100,100,z])
					bars.data(data);
					bars.width(300);
					bars.height(400);
					bars.depth(500);
					bars.gridsOn();

					////////////GUARDAR LA VISUALIACION EN EL SCOPE
					$scope.actualVis = {
 					 chartType: "bubbles",
 					 chartObject: $.extend(true, {}, bars),
					 bucketsSelected : $scope.bucketsSelected,
					 metricsSelected : $scope.metricsSelected
 				 }
				 //$scope.actualVis = $.extend(true, {}, bars);
 				 console.log("SCOPE CON LA VISUALIZACIÓN", $scope)

					for (var i = 0; i < dash.allCharts.length; i++) {
						 dash.allCharts[i].reBuild()
					}
					//bars.render();
			}


			var getKeysOne=function(datos) {
			  var keysOne=[];
				for (var i = 0; i < datos.length; i++) {
				  if(keysOne.indexOf(datos[i].key1)===-1){
				    keysOne.push(datos[i].key1);
				  }
				 }
			return keysOne;
			}

			var getKeysTwo=function(datos) {
			  var keysTwo=[];
			for (var i = 0; i < datos.length; i++) {
			  if(keysTwo.indexOf(datos[i].key2)===-1) keysTwo.push(datos[i].key2);
			};
			return keysTwo;
			}

			/* Construct structure of this sort (1 = actual element, gap = false)
			   (Additional function in order to get Missing gaps)
			   1   1
			   1 1 1 1
			   1 1 1 1
			   */
			var getAdditionalMesh = function(keysOne, keysTwo, datos){

			  var additionalStructure = [];
			  var ycolumn;
			  var itExists;
			    for (var j = 0; j < keysOne.length; j++){
			    ycolumn = [];
			      for (var k = 0; k < keysTwo.length; k++){
			        for (var i = 0; i < datos.length; i++){
			          itExists = false;
			          if ((datos[i].key1 === keysOne[j]) && (datos[i].key2 === keysTwo[k])){
			            itExists = datos[i];
			            break;
			          }
			        }
			        ycolumn.push(itExists);
			      }
			    additionalStructure.push(ycolumn);
			    }
			  return additionalStructure;
			}

			var getOrderedDataTD = function (datos){
			  var finalData = [];
			  var keysOne = getKeysOne(datos);
			  var keysTwo = getKeysTwo(datos);
			  var additionalStructure = getAdditionalMesh(keysOne, keysTwo, datos);
			  for (var j = 0; j < keysOne.length; j++){
			    for (var k = 0; k < keysTwo.length; k++){
			        if (!additionalStructure[j][k]){
			          additionalStructure[j][k] = {key1: keysOne[j], key2: keysTwo[k], value: 0};
			        }
			      }
			    }

			  for (var j = 0; j < keysTwo.length; j++){
			    for (var k = 0; k < keysOne.length; k++){
			      finalData.push(additionalStructure[k][j]);
			    }
			  }
			  return finalData;
			}

			var getOrderedDataBubbles = function (datos){
			  var finalData = [];
			  var keysOne = getKeysOne(datos);
			  var keysTwo = getKeysTwo(datos);
			  var additionalStructure = getAdditionalMesh(keysOne, keysTwo, datos);
			  for (var j = 0; j < keysOne.length; j++){
			    for (var k = 0; k < keysTwo.length; k++){
			        if (!additionalStructure[j][k]){
			          additionalStructure[j][k] = {key1: keysOne[j], key2: keysTwo[k], value: 0, value2: 0};
			          //missingGaps.push({key1: keysOne[j], key2: keysTwo[k], value: 0})
			        }
			      }
			    }

			  for (var j = 0; j < keysTwo.length; j++){
			    for (var k = 0; k < keysOne.length; k++){
			      finalData.push(additionalStructure[k][j]);
			    }
			  }
			  return finalData;
			}

/////////////////////////////////CONSTRUCCIÓN DE THREEDC////////////////////////////////////////////

        var container, scene, camera, renderer;

        //objetc which will contain the library functions
        var dash;

        init();
        animate();

        function init () {

           ///////////
           // SCENE //
           ///////////
           scene = new THREE.Scene();

           ////////////
           // CAMERA //
           ////////////
					 // attach div element to variable to contain the renderer
					 container = document.getElementById( 'ThreeJS' );

           // set the view size in pixels (custom or according to window size)
           var SCREEN_WIDTH = container.clientWidth;
           var SCREEN_HEIGHT = container.clientHeight;
					 //var SCREEN_WIDTH = window.innerWidth;
           //var SCREEN_HEIGHT = window.innerHeight;
           // camera attributes
           var VIEW_ANGLE = 45;
           var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
           var NEAR = 0.1;
           var FAR = 20000;
              // set up camera
           camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
           // add the camera to the scene
           scene.add(camera);
           // the camera defaults to position (0,0,0)
           //    so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
           camera.position.set(-553,584,868);

           //////////////
           // RENDERER //
           //////////////
           renderer = new THREE.WebGLRenderer( {antialias:true} );
           renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
           renderer.setClearColor( 0xd8d8d8 );


           // attach renderer to the container div
           container.appendChild( renderer.domElement );

          ////////////
          // EVENTS //
          ////////////


          // automatically resize renderer
          THREEx.WindowResize(renderer, camera);

           ///////////
           // LIGHTS //
           ///////////
           var light1 = new THREE.PointLight(0xffffff,0.8);
           light1.position.set(0,2500,2500);
           scene.add(light1);

           var light2 = new THREE.PointLight(0xffffff,0.8);
           light2.position.set(-2500,2500,-2500);
           scene.add(light2);

           var light3 = new THREE.PointLight(0xffffff,0.8);
           light3.position.set(2500,2500,-2500);
           scene.add(light3);

           // create a set of coordinate axes to help orient user
           //    specify length in pixels in each direction
           var axes = new THREE.AxisHelper(1000);
           scene.add(axes);

					 //the empty object will be returned with the library functions
           dash = THREEDC({},camera,scene,renderer,container);


           dash.renderAll();

        }

        function animate(){
           requestAnimationFrame( animate );
           render();
           update();
        }

        function render(){
           renderer.render( scene, camera );
        }

        function update(){
          dash.controls.update();
        }


///////////////////////////////////SAVE VIS////////////////////////////////////

				$scope.openSaveModal = function() {

					if(!$scope.actualVis){
						Notification.error("First build a visualization")
						return
					}

						ModalService.showModal({
		            templateUrl: 'modal.html',
								scope: $scope,
		            controller: function($scope, close) {

									 $scope.save = function(result) {
									 	console.log("Queremos guardar ---- ", $scope.name, $scope.description, $scope.$parent.actualVis)


										var promiseCheck = generatorQueries.checkVis(ESService.client, $scope.name, $scope.description, $scope.$parent.actualVis.chartType, $scope.$parent.actualVis.chartObject)
										//ERROR GUARDANDO COMPROBAMOS SI EXISTE
										promiseCheck.then(function(response, error){
											if(error){
												Notification.error("ElasticSearch error")
											}

											//SI EXISTE SE CREA DE 0, SI NO HAY QUE PREGUNTAR SI QUIERE SOBREESCRIBIRSE
											if(response.hits.hits.length == 0){
												var promiseSave = generatorQueries.createVis(ESService.client, $scope.name, $scope.description, $scope.$parent.actualVis.chartType, $scope.$parent.actualVis.chartObject, $scope.$parent.actualVis.metricsSelected, $scope.$parent.actualVis.bucketsSelected)
												promiseSave.then(function(response, error){
													if(error){
														Notification.error("Error saving visualization")
														return
													}
													Notification.success("Visualization saved")
												})
											}else{
												console.log("Modal of confirm");
												//MODAL DE CONFIRMACION
												ModalService.showModal({
								            templateUrl: 'modalconfirm.html',
														scope: $scope,
								            controller: function($scope, close) {

															 $scope.confirmUpdate = function(result) {
															 	console.log("Actualizar ---- ", $scope.name, $scope.description, $scope.$parent.actualVis)
																var promiseUpdate = generatorQueries.updateVis(ESService.client, $scope.name, $scope.description, $scope.$parent.actualVis.chartType, $scope.$parent.actualVis.chartObject, $scope.$parent.actualVis.metricsSelected, $scope.$parent.actualVis.bucketsSelected)
																promiseUpdate.then(function(response, error){
																	if(error){
																		Notification.error("Error updating visualization")
																		return
																	}
																	Notification.success("Visualization udated")
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



///////////////////////////////////LOAD VIS////////////////////////////////////

				$scope.openLoadModal = function() {

					if(!$scope.indexName){
						Notification.error("First select an Index")
						return
					}

					ModalService.showModal({
							templateUrl: 'loadmodal.html',
							scope: $scope,
							controller: function($scope, close) {

								//Me traigo las visualizaciones
								var promise = ESService.client.search({
						      index: ".visthreed",
						      type: 'items',
						      size: 10000,
						      body: { "query": { "match_all": {} } }
						    });

								promise.then(function (resp) {
									console.log("Cargadas: ", resp.hits.hits)
									$scope.loadedvis = resp.hits.hits;
								})



							}
					}).then(function(modal) {
							modal.element.modal();
							modal.close.then(function(result) {
									console.log("modal cerrado de carga")
							});
					});
				};

				})
      }



      VisualizeController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return VisualizeController;

});
