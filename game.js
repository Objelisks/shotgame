define(function(require, exports) {

	var input = require('game/system/input');
	var Player = require('game/things/player');
	var Block = require('game/things/block');
	var Level = require('game/system/level');

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera.position.set(5, 5, 5);

	var level = new Level();
	var timestep = 1/60;


	var player = new Player(level);
	camera.lookAt(player.position);
	level.add(player);


	for(var i = 0; i < 35; i++) {
		var block = new Block('tree');
		block.position.set(Math.random() * -40 + 20, 0, Math.random() * -40 + 20);
		block.body.position.copy(block.position);
		level.add(block);
	}


	var light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(1, 1, 1);
	level.add(light);
	light = new THREE.HemisphereLight(0x888888, 0x888888, 0.5);
	level.add(light);

	level.add(new THREE.AxisHelper());
	var ground = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 100),
		new THREE.MeshLambertMaterial({color:0x6AB417}));
	ground.rotation.x = -Math.PI/2;
	ground.position.y = -0.5;
	level.add(ground);

	var clock = new THREE.Clock(true);
	function render() {
		requestAnimationFrame(render);
		renderer.render(level, camera);
		var delta = clock.getDelta();

		level.update(delta);

		input.update(delta);
	}
	render();


	// input
	// movement
	// collision
	// shot gun
	// bullets
	// pooling
	// bullet death
	// screenshake
	// terrain
	// snd efx

});