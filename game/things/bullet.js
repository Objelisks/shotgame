define(function(require, exports) {
	
	var collisionGroups = require('game/helpers/collisionGroups');
	var loader = require('game/helpers/loader');
	var forward = new THREE.Vector3(1, 0, 0);

	var Bullet = function(direction) {
		THREE.Object3D.call(this);

		this.direction = direction;
		this.movespeed = 5.0;
		this.life = new THREE.Clock(true);
		this.maxLife = 2.0;

		var self = this;
		loader.model('bullet', function(geometry, materials) {
			self.add(new THREE.Mesh(geometry, materials[0]));
		});

		this.body = new CANNON.Body({
			mass: 1.0,
		});
		this.body.collisionFilterGroup = collisionGroups.bullet;
		this.body.collisionFilterMask = collisionGroups.terrain;
		this.body.addShape(new CANNON.Box(new CANNON.Vec3(0.4, 0.4, 0.4)));

		var velocity = direction.clone().multiplyScalar(this.movespeed);
		this.body.velocity.set(velocity.x, velocity.y, velocity.z);
		// use static materials to assign other body variables

	}
	Bullet.prototype = Object.create(THREE.Object3D.prototype);

	Bullet.prototype.update = function(delta) {
		//var movement = this.direction.clone().multiplyScalar(delta * this.movespeed);
		//this.position.add(movement);

		// todo good use of component pattern here
		this.position.copy(this.body.position);
		this.direction.copy(this.body.velocity).normalize();
		this.quaternion.setFromUnitVectors(forward, this.direction);

		if(this.life.getElapsedTime() > this.maxLife) {
			this.dead = true;
			this.visible = false;
			this.dispatchEvent({'type': 'death'});
		}
	}

	return Bullet;

});