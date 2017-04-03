define(
		function() {
      function PanelsController($scope, esFactory, ESService, ModalService, Notification) {
				angular.element(document).ready(function () {

	        ///////////////////////////VISUALIZACIONES CARGADAS///////////////////////////
	        //Me traigo las visualizaciones
					$scope.editingPanel = true;
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


					$scope.createNewPanel = function(position, nchart, dimension, op){
						$scope.actualPanel=dash.addPanel(position, nchart, dimension, op);

						dash.renderAll()

					}

					//////////////////////////////////////AÑADIR VIS A PANEL//////////////////////
					$scope.addToPanel = function(vis){
						console.log("A AÑADIR", vis);

						switch (vis.chartType) {
								case "pie":
										dash.pieChart($scope.actualPanel).data(vis.visobject._data).addCustomEvents(editVis).render();
										break
								case "bars":
										dash.barsChart($scope.actualPanel).data(vis.visobject._data).render();
										break;
								case "line":
										dash.lineChart($scope.actualPanel).data(vis.visobject._data).render();
										break;
								case "curve":
										dash.smoothCurveChart($scope.actualPanel).data(vis.visobject._data).render();
										break;
								case "3DBars":
										dash.TDbarsChart($scope.actualPanel).data(vis.visobject._data).gridsOn().render();
										break;
								case "bubbles":
										dash.bubbleChart($scope.actualPanel).data(vis.visobject._data).gridsOn().render();
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
							console.log(mesh.parentChart)
							console.log(object3d)
							console.log($scope)

							//Apply para que se apliquen los cambios al $scope
							$scope.$apply(function(){
								$scope.editingPanel = false;
								$scope.editingVis = true;
							})

						});
						console.log($scope.editingPanel)
					}
					/////////////////////////////////////////////////////////////////////////////

					///////////////////////////////////////////THREEDC/////////////////////////////////////////
					var container, scene, camera, renderer;

	        //objetc which will contain the library functions
	        var dash;

	        init();
	        animate();
					$scope.createNewPanel([100,100,100],4,[500,500],1);

	        function init () {

	           ///////////
	           // SCENE //
	           ///////////
	           scene = new THREE.Scene();

	           ////////////
	           // CAMERA //
	           ////////////
						 // attach div element to variable to contain the renderer
						 container = document.getElementById( 'ThreeJSPanels' );

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

					/////////////////////////////////////////////////////////////////////////////////////

				});
      }

      PanelsController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return PanelsController;

});
