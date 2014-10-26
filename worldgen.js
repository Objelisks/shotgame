#!/usr/bin/node

var fs = require('fs');
var SimplexNoise = require('simplex-noise');
var alea = require('alea');

var world = {};
var width = 20;
var height = 20;
var seed = 654;
var scale = 8;
var i = 0, j = 0;
var grass = new SimplexNoise(alea(seed));
var wall = new SimplexNoise(alea(seed * 3));
var forest = new SimplexNoise(alea(seed * 7));
var pyramid = new SimplexNoise(alea(seed * 11));
var g, w, f, p;

fs.writeFileSync('world.json', '{ "world": [\n');

for (i = 0; i < width; i++) {
	world[i] = [];
	for (j = 0; j < height; j++) {
		var si = i / scale, sj = j / scale;
		g = grass.noise2D(si, sj) + 0.4, w = wall.noise2D(si, sj), f = forest.noise2D(si, sj), p = pyramid.noise2D(si, sj);
		if(g === Math.max(g, w, f, p)) {
			world[i][j] = 0;
		} else if(w === Math.max(g, w, f, p)) {
			world[i][j] = 1;
		} else if(f === Math.max(g, w, f, p)) {
			world[i][j] = 2;
		} else {
			world[i][j] = 3;
		}
	};
	fs.appendFileSync('world.json', JSON.stringify(world[i]));
	if(i === width - 1) {
		fs.appendFileSync('world.json', '\n');
	} else  {
		fs.appendFileSync('world.json', ',\n');
	}
};

fs.appendFileSync('world.json', '\n]}');