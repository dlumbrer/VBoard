define(
		function() {
      function PanelsController($scope, esFactory, ESService, ModalService, Notification) {

        ///////////////////////////VISUALIZACIONES CARGADAS/////////////////////////// 
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

      PanelsController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return PanelsController;

});
