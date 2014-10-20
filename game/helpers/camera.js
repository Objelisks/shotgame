define(function(require, exports) {

	var CameraFollower = function(camera, target) {
		this.offset = new THREE.Vector3(5, 5, 5);
		this.camera = camera;
		this.target = target;
	}

	CameraFollower.prototype.update = function(delta) {
		this.camera.position.set(this.target.position.x + this.offset.x,
			this.target.position.y + this.offset.y,
			this.target.position.z + this.offset.z);
		this.camera.lookAt(this.target.position);
	}


	return {
		'follow': CameraFollower
	};

});