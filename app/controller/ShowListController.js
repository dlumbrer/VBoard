define(
  function () {
    function ShowListController($scope, $route, $routeParams, $location, esFactory, ESService, ModalService, Notification) {
      angular.element(document).ready(function () {

        var generatorQueries = genES()
        var builderData = builderESDS()

        //Me traigo los dashboards
        var promise = genES.loadAllDashboards(ESService.client);

        promise.then(function (resp) {
          console.log("Dashboards cargados: ", resp.hits.hits)
          $scope.loadeddashboards = resp.hits.hits;
        })

        $scope.showDash = function (dash) {
          $location.url('/Show/' + dash._id);
        }
      });
    }

    ShowListController.$inject = ['$scope', '$route', '$routeParams', '$location', 'esFactory', 'ESService', 'ModalService', 'Notification'];

    return ShowListController;

  });
