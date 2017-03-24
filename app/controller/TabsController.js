define(
		function() {
      function TabsController($scope, esFactory, ESService, ModalService, Notification) {
         $scope.active = 1;
         $scope.changeTab = function(tab) {
           console.log($scope.active);
           $scope.active = tab;
         }
      }



      TabsController.$inject = [ '$scope', 'esFactory', 'ESService', 'ModalService', 'Notification'];

			return TabsController;

});
