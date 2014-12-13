#!/usr/bin/env node

var pluginlist = [
	'com.ionic.keyboard', 
	'org.apache.cordova.console', 
    'org.apache.cordova.device', 
    'https://github.com/brodysoft/Cordova-SQLitePlugin'
];

var fs = require('fs');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    sys.puts(stdout)
}

pluginlist.forEach(function(plug) {
    exec('cordova plugin add ' + plug, puts);
});