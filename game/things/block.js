define(function(require, exports) {

	var collisionGroups = require('game/helpers/collisionGroups');
	var loader = require('game/helpers/loader');

	var Block = function(name) {
		THREE.Object3D.call(this);

		var self = this;
		loader.model(name, function(geometry, materials) {
			self.add(new THREE.Mesh(geometry, materials[0]));
		});

		this.body = new CANNON.Body({
			type: CANNON.Body.STATIC
		});
		this.body.collisionFilterGroup = collisionGroups.terrain;
		this.body.collisionFilterMask = collisionGroups.bullet + collisionGroups.player;
		this.body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));

	}
	Block.prototype = Object.create(THREE.Object3D.prototype);



	return Block;

});