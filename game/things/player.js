define(function(require, exports) {

	var collisionGroups = require('game/helpers/collisionGroups');
	var ComponentHolder = require('game/helpers/component');
	var input = require('game/system/input');
	var Gun = require('game/things/gun');

	// Player is a single? object that is controlled by actual input, has weapon
	// and shots it (gun)
	var Player = function(level) {
		THREE.Object3D.call(this);
		ComponentHolder.call(this);

		this.level = level;
		
		var model = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshLambertMaterial({color:0x405B64}));
		this.add(model);

		this.body = new CANNON.Body({
			mass: 10.0,
			linearDamping: 0.9
		});
		this.body.fixedRotation = true;
		this.body.updateMassProperties();
		this.body.collisionFilterGroup = collisionGroups.player;
		this.body.collisionFilterMask = collisionGroups.terrain;
		this.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));


		this.gun = new Gun(level);
		this.add(this.gun);
		this.gun.position.set(0.5, 0, 0);

		this.movespeed = 15.0;
		this.minInput = 0.2;
		this.fireRate = 0.1;
		this.fireTick = 0;
	}
	Player.prototype = Object.create(THREE.Object3D.prototype);

	Player.prototype.update = function(delta) {
		// copy from physics
		this.position.copy(this.body.position);
		this.quaternion.copy(this.body.quaternion);

		// calculate movement vector and apply
		if(input.move.length() > this.minInput) {
			var rotation = -45 * Math.PI / 180;
			var dx = input.move.x * delta * Math.cos(rotation)
				+ input.move.y * delta * -Math.sin(rotation);
			var dz = input.move.x * delta * Math.sin(rotation)
				+ input.move.y * delta * Math.cos(rotation);
			var movement = new CANNON.Vec3(dx * this.movespeed, 0, dz * this.movespeed);
			this.body.velocity.x += movement.x;
			this.body.velocity.z += movement.z;
			//this.body.applyImpulse(movement, this.body.position);
		}

		// shoot gun
		this.fireTick += delta;
		if(input.fire.length() > this.minInput) {
			var rotation = -45 * Math.PI / 180;
			var dx = input.fire.x * delta * Math.cos(rotation)
				+ input.fire.y * delta * -Math.sin(rotation);
			var dz = input.fire.x * delta * Math.sin(rotation)
				+ input.fire.y * delta * Math.cos(rotation);

			var aim = new THREE.Vector3(dx, 0, dz).normalize();
			this.gun.position.copy(aim);

			if(this.fireTick > this.fireRate) {
				this.gun.fire(aim, this.body.velocity);
				this.fireTick = 0;
			}
		}

		this.dispatchEvent({'type': 'update', 'delta': delta});
	}

	return Player;

});