define(function(require, exports) {

	var CameraFollowerComponent = function(camera, target) {
		this.offset = new THREE.Vector3(5, 15, 5);
		this.camera = camera;
		this.target = target;
	}

	CameraFollowerComponent.prototype.update = function(delta) {
		this.camera.position.set(this.target.position.x + this.offset.x,
			this.target.position.y + this.offset.y,
			this.target.position.z + this.offset.z);
		this.camera.lookAt(this.target.position);
	}


	return CameraFollowerComponent;

});