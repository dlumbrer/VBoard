var myApp = angular.module('myApp', ['elasticsearch']);

myApp.service('client', function (esFactory) {
  return esFactory({
    host: 'http://localhost:9200',
  });
});

myApp.controller('MainController', function($scope, client, esFactory) {
  $scope.foo = "David"
  /*client.ping({
    requestTimeout: 30000,
  }, function (error) {
    if (error) {
      console.error('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });*/

  client.search({
    index: 'opnfv',
    type: 'items',
    /*body: {
      query: {
        match: {
          body: 'elasticsearch'
        }
      }
    }*/
  }).then(function (resp) {
      $scope.hits = resp.hits.hits;
      console.log($scope.hits)
  }, function (err) {
      console.trace(err.message);
  });

});
