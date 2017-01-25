/*myApp.service('client', function (esFactory) {
  return esFactory({
    host: 'http://localhost:9200',
  });
});*/

define([], function() {
	function ESService(esFactory) {
		this.client = esFactory({
      host: 'http://localhost:9200',
    });
	}
	return ESService;
});
