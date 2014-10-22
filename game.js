define(function(require, exports) {

	var loader = require('game/helpers/loader');
	var input = require('game/system/input');
	var Player = require('game/things/player');
	var Level = require('game/system/level');
	var CameraFollowComponent = require('game/helpers/camera');

	var width = 1024;
	var height = 768;

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	camera.position.set(5, 15, 5);

	var level = new Level();
	var timestep = 1/60;

	loader.file('world.json', function(file) {
		var leveldata = JSON.parse(file).world;
		level.generate(leveldata);
	});

	var player = new Player(level);
	level.add(player);
	level.addComponent(new CameraFollowComponent(camera, player));


	var light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(1, 1, 1);
	level.add(light);
	light = new THREE.HemisphereLight(0x888888, 0x888888, 1.0);
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