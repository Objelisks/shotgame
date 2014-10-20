define(function(require, exports) {

	var Input = function() {
		this.move = new THREE.Vector2(0, 0);
		this.fire = new THREE.Vector2(0, 0);
		this.gamepadIndex = 0;
	}

	Input.prototype.update = function(delta) {
		if(this.gamepadIndex === null) return;
    	var gamepads = navigator.getGamepads();
    	if(gamepads[this.gamepadIndex] === undefined) return;

     	var updatedValues = navigator.getGamepads()[this.gamepadIndex];
     	if(!updatedValues.connected) return;

     	this.move.set(updatedValues.axes[0], updatedValues.axes[1]);
     	this.fire.set(updatedValues.axes[2], updatedValues.axes[3]);
	};


	// singleton
	return new Input();

});