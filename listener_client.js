

var cluster  = require('cluster'),
_portSocket  = 8080;
_portRedis   = 6379;
_HostRedis   = '127.0.0.1';
var bodyParser = require('body-parser');

// If is Master
if (cluster.isMaster)
{	
	// Create the server instance but don't let http listen yet. The workers will listen. This is simply to create the server instance
        var server      = require('http').createServer(),
	    socketIO    = require('socket.io').listen(server),
	    redis       = require('socket.io-redis');	
	
	//socketIO.adapter(redis({ host: _HostRedis, port: _portRedis }));
	
	// This can be manually done but all this does is create a new worker/process for each CPU core on your machine 
	var numberOfCPUs = require('os').cpus().length;
	for (var i = 0; i < numberOfCPUs; i++) {
		cluster.fork();		
	}
	
	cluster.on('fork', function(worker) {
            console.log('worker %s spawned', worker.id);
        });
        cluster.on('online', function(worker) {
            console.log('worker %s online', worker.id);
        });
        cluster.on('listening', function(worker, addr) {
            console.log('worker %s listening on %s:%d', worker.id, addr.address, addr.port);
        });
        cluster.on('disconnect', function(worker) {
            console.log('worker %s disconnected', worker.id);
        });
        cluster.on('exit', function(worker, code, signal) {
            console.log('worker %s died (%s)', worker.id, signal || code);
            if (!worker.suicide) {
                console.log('restarting worker');
               // cluster.fork();
            }
        });	
}

if(cluster.isWorker)
{ 
     
	var app         = require('express')(),
    //ent         = require('ent'),
    fs          = require('fs'),
    server      = require('http').createServer(app).listen(_portSocket),
    socketIO    = require('socket.io').listen(server);

    var redis       = require('socket.io-redis');

	socketIO.adapter(redis({ host: _HostRedis, port: _portRedis }));

	//We define a route handler "/" that gets called when we hit our website home.
	app.get('/', function (req, res) {
	res.json({status:0 ,pub_sub : "on "+ cluster.worker.id })
	});





	// mqtt 
	var mqtt = require('mqtt');

	var client = mqtt.createClient(1883, 'localhost');

	client.on('connect', function(){

		 console.log('Connected to mqtt broker with ClientId:', client.options.clientId);


		 

		 client.subscribe('/heartbeat');

		 client.on('message', function(topic, message, packet){

					    console.log('Received Message in ' + cluster.worker.id );
			
 	 					
					    console.log('topic:', topic, 'message', message.toString() , 'packet' , packet );
			
						
						// socketIO.of('/' + req.body.namespace).emit(req.body.channel, req.body.message);	

						//socketIO.of('/').emit(topic, message.toString());	


				  });

		 

	});




}


