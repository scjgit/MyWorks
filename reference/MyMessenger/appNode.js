var app = require('express')(), server = require('http').createServer(app), io = require('socket.io').listen(server);

server.listen(7777);
var users = new Array();
var offlineData = new Array();
var clients = {};
var socket_log = 'Socket_ ';

app.get('/*', function(req, res) {

	console.log('calling url : ' + req.url);
	//console.log('req.url.length : ' + req.url.length);
	//console.log('req.url.indexOf(/) : ' + req.url.indexOf('/'));
	//console.log('req.url.split(/)[1]: ' + req.url.split('/')[1]);

	if (req.url.length < 2 || (req.url.length > 1 && req.url.indexOf('/') != (-1) && req.url.split('/')[1] == 'myMessenger')) {
		console.log('Serving : /index.html');
		res.sendfile(__dirname + '/index.html');
	} else if (req.url.length > 1 && req.url.indexOf('/') != (-1)) {
		try {
			console.log('Serving : ' + req.url);
			res.sendfile(__dirname + req.url);
		} catch (e) {
		}

	}
});

io.set('log level', 2); 

io.sockets.on('connection', function(socket) {
	console.log(socket_log + 'started');

	socket.on('broadcast:msg', function(data) {

		console.info(socket_log + "Message from: " + data.from + ", to: " + data.to + ", message:" + data.message);

		if (clients[data.to]) {
			io.sockets.socket(clients[data.to].socket).emit(data.to.toLowerCase(), [ {
			    message : data.message,
			    from : data.from
			} ]);

		} else {
			console.warn(socket_log + 'User ' + data.to + ' is not logged in');

			var offdata = new Array();
			if (offlineData[data.to] == undefined) {
				console.log(socket_log + 'offlineData[data.to]=' + offlineData[data.to]);
				offdata.push({
				    from : data.from,
				    message : data.message
				});
				offlineData[data.to] = offdata;
			} else {
				console.info(socket_log + 'offlineData[data.to]=' + JSON.stringify(offlineData[data.to]));
				offdata = offlineData[data.to];
				if (offdata != undefined) {
					offdata.push({
					    from : data.from,
					    message : data.message
					});
					offlineData[data.to] = offdata;
				}
				console.info(socket_log + 'offlineData[data.to]=' + JSON.stringify(offlineData[data.to]));
			}

		}
		console.log('');
	});
	socket.on('user:add', function(data) {

		if (users.indexOf(data.userName) < 0) {
			users.push(data.userName);
		}
		clients[data.userName] = {
			"socket" : socket.id
		};

		console.info(socket_log + data.userName + " logged in");
		// console.log(socket_log+"Logged in users Count: "+ users.length);
		socket.emit(data.userName, [ {
		    message : 'Welcome to myMessenger',
		    from : ''
		} ]);

		var messageArr = [];
		console.log(JSON.stringify(offlineData));
		if (offlineData[data.userName] != undefined) {
			 console.log(socket_log+"before splicing "+JSON.stringify(offlineData[data.userName])+" from index: "+offlineData.indexOf(data.userName));
			
			socket.emit(data.userName.toLowerCase(), offlineData[data.userName]);
			offlineData[data.userName]={};
			console.log(socket_log+"after splicing "+JSON.stringify(offlineData[data.userName]));
		}
		socket.broadcast.emit('newUser', users);
		socket.emit('newUser', users);
		console.log('');
	});
});

console.error('Messenger started running.. url: http://localhost:7777/')