define(function(require, exports) {

	var Loader = function() {
		THREE.EventDispatcher.call(this);
	}
	Loader.prototype = Object.create(THREE.EventDispatcher.prototype);

	var jsonLoader = new THREE.JSONLoader();
	var xhrLoader = new THREE.XHRLoader();

	var modelCache = {};

	Loader.prototype.model = function(name, callback) {
		var cached = modelCache[name];
		if(cached && cached !== 'loading') {
			callback(cached.geo, cached.mats);
			return;
		}

		var self = this;
		var eventCallback = function(event) {
			callback(event.geo, event.mats);
		}
		self.addEventListener(name, eventCallback);
		if(cached !== 'loading') {
			modelCache[name] = 'loading';
			jsonLoader.load('./models/' + name + '.json', function(geo, mats) {
				self.dispatchEvent({'type': name, 'geo': geo, 'mats': mats});
				modelCache[name] = {'geo': geo, 'mats': mats};
			});
		}
	}

	Loader.prototype.file = function(name, callback) {
		xhrLoader.load(name, callback);
	}


	// singleton
	return new Loader();

});