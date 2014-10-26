define(function(require, exports) {

	var Bullet = require('game/things/bullet');

	var Gun = function(level) {
		THREE.Object3D.call(this);

		var model = new THREE.Mesh(
			new THREE.BoxGeometry(0.2, 0.2, 0.2),
			new THREE.MeshLambertMaterial({color:0x00ff00}));
		this.add(model);

		this.level = level;
	}
	Gun.prototype = Object.create(THREE.Object3D.prototype);

	Gun.prototype.fire = function(dir, velocity) {
		var level = this.level;
		var bullet = new Bullet(dir.clone());
		bullet.body.velocity.vadd(velocity, bullet.body.velocity);
		bullet.body.position.copy(this.localToWorld(this.position.clone()));
		bullet.position.copy(bullet.body);
		level.add(bullet);
		level.bullets.push(bullet);
		bullet.addEventListener('death', function(event) {
			level.remove(bullet);
			level.bullets.splice(level.bullets.indexOf(bullet), 1);
		});
	}

	return Gun;

});