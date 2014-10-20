define(function(require, exports) {

	//var item = { dead: true, thing: { ... , pool: parent } };

	var Pool = function(type) {
		this.things = [];
		this.deadCount = 0;
		this.type = type;
	}

	Pool.prototype.new = function() {
		//recycle old

	};

	Pool.prototype.kill = function(thing) {
		//set dead increase dead count
	};

	return Pool;

});