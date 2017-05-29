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
var debrow = require('detect-browser')
function replace_space(string){
	return string.trim();
}
function clear_space(string, length){
	if (length < string.length){
		var new_string = string.substr(length-1, string.length - length -1);
		var replaced_string = replace_space(new_string);
		return replaced_string;
	}
	return false;
}
function validate_whois(data){
	var new_data = [];
	var needle = ["inetnum: ", "netname: ", "origin: ", "person: ", "role: ", "route: "];
	for (var a = 0; a < data.length; a++){
		var search_found = -1;
		for (b = 0; b < needle.length; b++){
			if (data[a].search(needle[b]) >= 0){
				var jsonVar = {};
				jsonVar[needle[b]] = clear_space(data[a], needle[b].length);
				new_data.push(jsonVar);
			}
		}
	}
	return new_data;
}
app.get('/', function(request, response){
	response.send("Hello world");
});
app.get('/track', function(req, res){
	var ipRequest = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var headers = req.headers;
	var cookie = req.headers.cookie;
	var browser = debrow;
	externalip(function(err, ip){
		var geo = geoip.lookup(ip);
		ipRequest = ip;
		node_whois.lookup(ipRequest, function(err, data){
			var whois_callback = data.split('\n');
			whois_callback.sort();
			whois_callback = validate_whois(whois_callback);
			var toReturn = {
				ip: ipRequest,
				geoip: geo,
				cookie: cookie,
				headers: headers,
				who_is: whois_callback,
				browser: browser
			};
		
			res.send(toReturn);
		});
	});
});
var port = process.env.port || 3000;
app.listen(port);
//app.listen(80);
