#!/usr/bin/node


var path = require('path');
var exec = require('child_process').exec;
var files = process.argv.slice(2);

console.log(files);
console.log(process.cwd());

files.forEach(function(file) {
  console.log('converting', file);
  var name = path.basename(file, path.extname(file));
  exec('python convert_obj_three.py -i ' + file + ' -o ' + process.cwd() + '/' + name + '.json',
    function(error, stdout) {
      if(error !== null) {
        console.log('ERROR', file, ':', error);
      } else {
        console.log('SUCCESS', file);
      }
    });
});
