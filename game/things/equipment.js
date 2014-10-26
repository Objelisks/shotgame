define(function(require, exports) {

	// digetic tablet menu thing
	// temp layout:
	// atk def utl hld
	// [ ] [ ] [ ] [ ]
	// [ ] [ ] [ ] [ ]

	/* ABILITY TABLE
	
	runes have three flavors: r g b (temp)
	player starts with one of each, gains one additional of each through play
	obvs taking [atk rr] prevents using r for def or utl
	skills can be very strong but balanced by forcing player to use certain runes in certain locations
	example: area causes dot unless protected by [def rr], and then enemies are only vulnerable to [atk r*]
	player has to take damage over time and kill enemies quickly, or avoid them and pass through slowly

	r fire speed close 
	g angles sustain range
	b area timer remote

	dot, splash, stun, penetrate, homing, bounce, melee, bomb, multi, drain, cone
	flight, fire resist, armor, speed, reflect, weakness, revive
	hookshot, spiritwalk, blink, 

	atk
	r fire melee (sword) - ice obstacle
	g bounce shot (gun) - reflect off wall target out of reach
	b area dmg (bomb) - hit multiple switches at the same time
	rr big sword cone hit - cut vulnerable out of reach
	rg penetrating sword lasers - special crystal blocks all but this projectile
	rb bomberman bomb - hit multiple targets in pattern
	gg split shot - hit multiple targets sustained
	gb stun shot - get moving object to stop
	bb block projectiles dot bomb - stop projectile from hitting target

	def
	r atkspd+ - high health enemy
	g armor+ - sustain damage
	b movspd+ - time attack
	rr fire protect - fire dot area
	rg reflect - lots of projectiles inc
	rb absorb - unique projectile relocate - absorbs one shot, holds for 1.5 sec, releases in original direction. if hit while holding, take dmg normally
	gg flight - fly over thing
	gb 
	bb blink - teleport past objstacle

	utl
	r 
	g 
	b grabber
	rr 
	rg 
	rb 
	gg 
	gb 
	bb 


	*/

	var input = require('game/system/input');

	var nodeFlavors = {
		'red': 0xff0000,
		'green': 0x00ff00,
		'blue': 0x0000ff
	};

	// col, row
	var slotLocations = [
		[new THREE.Vector3(-1, 0, -1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, -1)],
		[new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)],
	];

	var Node = function(data) {
		THREE.Object3D.call(this);

		var model = new THREE.Mesh(
			new THREE.BoxGeometry(0.5, 0.5, 0.5),
			new THREE.MeshLambertMaterial({color:nodeFlavors[data.flavor]}));
		this.add(model);

		this.position.copy(slotLocations[data.slot.y][data.slot.x]);

		// drag drop

	}
	Node.prototype = Object.create(THREE.Object3D.prototype);

	// equipment screen takes camera as argument because it lives in camera relative space
	var Equipment = function(camera) {
		THREE.Object3D.call(this);
		var self = this;

		// screen
		var model = new THREE.Mesh(
			new THREE.BoxGeometry(5, 0.2, 5),
			new THREE.MeshLambertMaterial({color:0x884444}));
		this.add(model);
		this.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/2);
		this.position.z -= 7;
		this.visible = false;

		// nodes
		this.nodes = [
			new Node({slot: new THREE.Vector2(0, 0), flavor: 'red'}),
			new Node({slot: new THREE.Vector2(1, 0), flavor: 'green'}),
			new Node({slot: new THREE.Vector2(2, 0), flavor: 'blue'}),
		];
		self.add.apply(this, this.nodes);

		this.gameInput = input.release();
		input.take(this.gameInput);

		this.modalInput = new THREE.EventDispatcher();

		var toggleScreen = function(e) {
			if(!e.message) return;
			self.visible = !self.visible;
			if(self.visible) {
				input.take(self.modalInput);
			} else {
				input.release(self.modalInput);
			}
		};

		// toggle on left shoulder press
		this.gameInput.addEventListener('leftShoulder', toggleScreen);
		this.modalInput.addEventListener('leftShoulder', toggleScreen);


		this.minInput = 0.8;
		this.selectMoveTimer = 0;
		this.selectedSlot = new THREE.Vector2(0, 0);
		this.selectIndicator = new THREE.Mesh(
			new THREE.BoxGeometry(0.7, 0.4, 0.7),
			new THREE.MeshLambertMaterial({color:0xaaaaaa}));
		this.add(this.selectIndicator);
		this.selectIndicator.position.copy(slotLocations[this.selectedSlot.y][this.selectedSlot.x]);

		this.modalInput.addEventListener('leftStick', function(e) {
			self.selectMoveTimer = Math.max(self.selectMoveTimer - e.delta, 0);
			if(e.message.length() > self.minInput) {
				if(self.selectMoveTimer === 0) {
					if(e.message.x > Math.abs(e.message.y)) {
						self.selectedSlot.x = THREE.Math.clamp(self.selectedSlot.x + 1, 0, 2);
					} else if(e.message.x < - Math.abs(e.message.y)) {
						self.selectedSlot.x = THREE.Math.clamp(self.selectedSlot.x - 1, 0, 2);
					} else if(e.message.y > Math.abs(e.message.x)) {
						self.selectedSlot.y = THREE.Math.clamp(self.selectedSlot.y + 1, 0, 1);
					} else if(e.message.y < - Math.abs(e.message.x)) {
						self.selectedSlot.y = THREE.Math.clamp(self.selectedSlot.y - 1, 0, 1);
					}
					self.selectIndicator.position.copy(slotLocations[self.selectedSlot.y][self.selectedSlot.x]);
					self.selectMoveTimer = 0.15;
				}
			}
		});
	}
	Equipment.prototype = Object.create(THREE.Object3D.prototype);


	return Equipment;

});