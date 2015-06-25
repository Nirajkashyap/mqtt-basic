var mqtt = require('mqtt');

var client = mqtt.createClient(1883, 'localhost');



client.on('connect', function(){

	 console.log('Connected to mqtt broker with ClientId:', client.options.clientId);


	 

	 client.subscribe('/heartbeat');

	 client.on('message', function(topic, message, packet){

				    console.log('Received Message');
		
				    console.log('topic:', topic, 'message', message , 'packet' , packet );
		
			  });


	 var message = {
	  topic: '/hello/world',
	  payload: 'abcde', // or a Buffer
	  qos: 0, // 0, 1, or 2
	  retain: false // or true
	};

	//client.publish('/heartbeat', "hi niraj");
	var PublishChannels =  ["/heartbeat" ,"/heartbeat2"]

  

	setInterval(function(){

		var CurrentChannel = PublishChannels[Math.floor(Math.random()*PublishChannels.length)];
		console.log(CurrentChannel)

		client.publish(CurrentChannel, "hi niraj");

	},2000)	
	 

});


