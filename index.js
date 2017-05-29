var express = require('express');
var app = express()
/*
Author Codename		: MGO-Manggala
Author Name		: Muhammad Ghozie Manggala
Application Name	: User Tracking
Creation		: May 23rd 2017, Jakarta, Indonesia

This module is to determine the client's data such us ip, client's ISP, and location.
These are the required library to get the detail information about client:
externalip	: Get the external ip of client
geoip-lite 	: Get the current location of client
node-whois	: Get the whois information (Internet Service Provider)
		  *this part need more research to extract the string into
		   data-able information
*/

var geoip = require('geoip-lite')
var node_whois = require('node-whois')
var externalip = require('externalip')

app.get('/', function(request, response){
	response.send("Hello world");
});
app.get('/track', function(req, res){
	console.log(req.headers);
	res.cookie('tracking', 'true', {maxAge: 10000, httpOnly:true});
	var date = new Date();
	var benchmarkStart = date.getTime();
	var ipRequest = '110.137.152.214';
	externalip(function(err, ip){
		console.log(ip);
		ipRequest = ip;
		node_whois.lookup(ipRequest, function(err, data){
			var callback = data.split('\n');
			callback.sort();
			console.log("benchmark: " + (benchmarkStart - date.getTime()).toString());
			res.send(callback);
		});
	});
});
//app.listen(80);
