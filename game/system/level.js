define(function(require, exports) {

	var ComponentHolder = require('game/helpers/component');
	var Block = require('game/things/block');

	var timeStep = 1/60;


	var Level = function() {
		THREE.Scene.call(this);
		ComponentHolder.call(this);

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
		this.dispatchEvent({'type': 'update', 'delta': delta});
	}

	Level.prototype.generate = function(leveldata) {

		this.add(new THREE.AxisHelper());
		
		var ground = new THREE.Mesh(
			new THREE.PlaneGeometry(100, 100),
			new THREE.MeshLambertMaterial({color:0x6AB417}));
		ground.rotation.x = -Math.PI/2;
		ground.position.y = -0.5;
		this.add(ground);

		var tiles = ['', 'tree', 'simple_block', 'green_block'];
		var block, scale = 2, self = this;
		leveldata.forEach(function(row, i) {
			row.forEach(function(tile, j) {
				if(tile !== 0) {
					block = new Block(tiles[tile]);
					block.position.set(i * scale, 0, j * scale);
					block.body.position.copy(block.position);
					self.add(block);
				}
			});
		});
/*
		var block = null, i = 0;
		for(i = 0; i < 35; i++) {
			block = new Block('tree');
			block.position.set(Math.random() * -40 + 20, 0, Math.random() * -40 + 20);
			block.body.position.copy(block.position);
			this.add(block);
		}

		for (i = 0; i < 10; i++) {
			block = new Block('simple_block');
			block.position.set(Math.random() * -40 + 20, 0, Math.random() * -40 + 20);
			block.body.position.copy(block.position);
			this.add(block);
		};

		for (i = 0; i < 10; i++) {
			block = new Block('green_block');
			block.position.set(Math.random() * -40 + 20, 0, Math.random() * -40 + 20);
			block.body.position.copy(block.position);
			this.add(block);
		};
		*/
	}

	return Level;

});