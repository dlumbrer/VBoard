define(
		['node_modules/bodybuilder/browser/bodybuilder.min'],
		function() {
      function MainController($scope, esFactory, ESService) {
        $scope.foo = "YEAH!"

				var bodybuilder = require('node_modules/bodybuilder/browser/bodybuilder.min')

        //////////////////////////////////PRIMERO OBTENER INDICES////////////////////////////////
				var generatorQueries = genES({})
				var builderData = builderESDS({})

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
          $scope.showMapping = true;
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
          $scope.showMetricBucketsForm = true;
          $scope.visType = $("#typesList").val();
					$scope.typeName = "items";
        }
        $scope.hideMetricsBucketsForm = function(){
          $scope.showMetricBucketsForm = false;
        }

        ///////////////////////////////////////////////////////////////////////

				/////////////////////////////////////////////////MOSTRAR CAMPOS A ELECCION SGUN EL TIPO DE METRICA/BUCKET////////////////////////////////////////////////7
				$scope.showFieldsOfMetricType = function(){
					switch ($scope.metricList) {
							case "avg":
									$scope.fieldsMetric = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,index) {
											if(allFields[key].type == "long"){
												$scope.fieldsMetric.push(key)
											}
									});
									break;
							case "sum":
									$scope.fieldsMetric = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,index) {
											if(allFields[key].type == "long"){
												$scope.fieldsMetric.push(key)
											}
									});
									break;
					}
				}
				$scope.showFieldsOfTypeAggregation = function(){
					switch ($scope.typeBucket) {
							case "terms":
									$scope.fields = Object.keys($scope.mapping[$scope.indexName].mappings[$scope.typeName].properties);
									break;
							case "date_histogram":
									$scope.fields = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,index) {
											if(allFields[key].type == "date"){
												$scope.fields.push(key)
											}
									});
									break;
							case "histogram":
									$scope.fields = [];
									var allFields = $scope.mapping[$scope.indexName].mappings[$scope.typeName].properties;
									Object.keys(allFields).forEach(function(key,index) {
											if(allFields[key].type == "long"){
												$scope.fields.push(key)
											}
									});
									break;
					}
				}
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////

				/////////////////////////////////////////////CUANDO SE PULSA EN ADD METRIC/BUCKET////////////////////////////////////////////////////////////////
				$scope.addMetricForm = function(){
					$scope.metricSelected = $("#metricList").val();
					//No añadir Count por que se hace automaticamente
					var options = {}
					switch ($scope.metricList) {
							case "count":
									break;
							case "avg":
									var fieldSelected = $("#fieldMetricList").val();
									builderData.addMetric($scope.metricList, fieldSelected);
									break;
							case "sum":
									var fieldSelected = $("#fieldMetricList").val();
									builderData.addMetric($scope.metricList, fieldSelected);
									break;
					}

					$scope.metricsSelected = builderData.metrics;
        }

				$scope.addSubbucketForm = function(){
					$scope.typeBucket = $("#aggregationBucketList").val();
					$scope.fieldBucketSelected = $("#fieldBucketsList").val();
					//$scope.sizeSelected = $("#sizeValue").val();

					var options = {}
					switch ($scope.typeBucket) {
							case "terms":
									$scope.fieldBucketSelected = $scope.fieldBucketSelected + ".keyword";
									options = {"size": $("#sizeValue").val()}
									break;
							case "date_histogram":
									options = {"interval": $("#intervalDateHistogram").val()}
									break;
							case "histogram":
									options = {"interval": $("#intervalHistogram").val()}
									break;
					}


          builderData.addBucket($scope.typeBucket, $scope.fieldBucketSelected, options)
					//console.log(builderData)
					$scope.bucketsSelected = builderData.buckets;
        }
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////


				///////////////////////////////////////////////////CUANDO SE PULSA EN PLAY//////////////////////////////////////////////////////////
        $scope.showData = function(){
					//Añadir lo que se ha quedado marcado
					$scope.addSubbucketForm()
					$scope.addMetricForm()

					var statements = builderData.buildDataStructure().getDataStructure()

					var promiseSearch = generatorQueries.buildBodybuilderObject(statements, bodybuilder).buildQuery().executeSearch(ESService.client, $scope.indexName)
					//PROMESA
					promiseSearch.then(function (resp) {
						$scope.hits = JSON.stringify(resp.hits, undefined, 2);
						$scope.aggregationsToShow = JSON.stringify(resp.aggregations, undefined, 2);
						$scope.aggregations = resp.aggregations;
						console.log($scope.aggregations)
						$scope.buildPie();

						//resetear datos
						builderData.buckets = [];
						//$scope.bucketsSelected = builderData.buckets;
						builderData.metrics = [];
						//$scope.bucketsSelected = builderData.metrics;

			    }, function (err) {
			        console.trace(err.message);
			    });

					//$scope.exexcuteSearch(bodyQuery);

        };
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////




				/////////////////////////FUNCIONES DE THREDC/////////////////////////////////////////////
				z = 0;
				$scope.buildPie = function(){

					var data = $scope.aggregations['agg_' + $scope.typeBucket + '_' + $scope.fieldBucketSelected].buckets.map(function(bucket) {
					 var value = bucket.doc_count;
						 return {
							 key: bucket.key,
							 value: value
							 };
				 });


				 z += 100;
				 pie=dash.pieChart([100,100,z])
				 pie.data(data)

				 for (var i = 0; i < dash.allCharts.length; i++) {
				 		dash.allCharts[i].reBuild()
				 }
				 //pie.render();
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
           // set the view size in pixels (custom or according to window size)
           var SCREEN_WIDTH = window.innerWidth;
           var SCREEN_HEIGHT = window.innerHeight;
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

           // attach div element to variable to contain the renderer
           container = document.getElementById( 'ThreeJS' );
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


      }

      MainController.$inject = [ '$scope', 'esFactory', 'ESService'];

			return MainController;

});
