/*jshint es5:true, node:true*/
var http, express, path, host, port, app, httpProxy, proxy, proxyHost;

http = require('http');
express = require('express');
httpProxy = require('http-proxy');

path = process.env.PWD + '/client';
host = '127.0.0.1';
port = 8000;

app = express();
proxy = new httpProxy.RoutingProxy();
proxyHost = 'monty-hall.cloudfoundry.com';

app.configure(function() {
	app.use(app.router);
	app.use(express.static(path));
	app.use(express.directory(path));
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.all('/games', proxyRequest);
app.all('/games/*', proxyRequest);

function proxyRequest(req, res) {
	req.url = req.url.replace('http://' + proxyHost + '/games', '');

	req.headers.host = proxyHost;
	
	proxy.proxyRequest(req, res, {
		host: proxyHost,
		port: 80
	});
}
console.log("Serving @ " + host + ":" + port + " (" + path + ")");
app.listen(port, host);