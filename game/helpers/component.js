define(function(require, exports) {

	var ComponentHolder = function() {
		this.components = [];
		this.addEventListener('update', function(e) {
			var delta = e.delta;
			this.components.forEach(function(component) {
				component.update(delta);
			});
		});
		this.addComponent = function(component) {
			this.components.push(component);
		};
		this.removeComponent = function(component) {
			this.components.splice(this.components.indexOf(component), 1);
		};
	}



	return ComponentHolder;

});