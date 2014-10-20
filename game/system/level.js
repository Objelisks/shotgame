define(function(require, exports) {

	var timeStep = 1/60;

	var Level = function() {
		THREE.Scene.call(this);

		this.world = new CANNON.World();
		this.bullets = [];
		this.player = null;
	}
	Level.prototype = Object.create(THREE.Scene.prototype);

	Level.prototype.add = function(thing) {
		THREE.Scene.prototype.add.call(this, thing);
		if(thing.body) {
			this.world.add(thing.body);
		}
	}

	Level.prototype.remove = function(thing) {
		THREE.Scene.prototype.remove.call(this, thing);
		if(thing.body) {
			this.world.remove(thing.body);
		}
	}

	Level.prototype.update = function(delta) {
		this.world.step(timeStep, delta, 10);
		this.children.forEach(function(c) {
			if(c.update) {
				c.update(delta);
			}
		});
		this.bullets.forEach(function(b) {
			if(!b.dead) {
				b.update(delta);
			}
		});
		// todo here or in object or in component?
		/*this.children.forEach(function(obj) {
			obj.position.copy(obj.body.position);
			obj.quaternion.copy(obj.body.quaternion);
		});*/
	}

	return Level;

});