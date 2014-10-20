define(function(require, exports) {

	var Loader = function() {
	}

	var jsonLoader = new THREE.JSONLoader();

	Loader.prototype.model = function(name, callback) {
		jsonLoader.load('./models/' + name + '.json', callback);
	}


	// singleton
	return new Loader();

});