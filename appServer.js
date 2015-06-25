var mosca = require('mosca')

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',        
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 1883,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/mqtt'
  },
  http: {
    port: 3000,
    bundle: true,
    static: './public'
  }
};


var authenticate = function(client, username, password, callback) {
  var authorized = (username === 'alice' && password.toString() === 'secret');
  if (authorized) client.user = username;
  callback(null, authorized);
}

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizePublish = function(client, topic, payload, callback) {
  callback(null, client.user == topic.split('/')[1]);
}

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizeSubscribe = function(client, topic, callback) {

  console.log(" authorizeSubscribe topic " + topic);
  //console.log(" authorizeSubscribe client " + client);
  if(topic == "/heartbeat2")
  {
    console.log("user is not allwed to litsen on /heartbeat2")
    callback("error","msg")

  }
  else
  {
    console.log(" authorizeSubscribe topic ..... yes " + topic);
    //console.log(client)
     //callback(null, client.user == topic.split('/')[1]);
    //callback("error", true);
    callback(null, true);


  }  
  
}





var server = new mosca.Server(moscaSettings);

server.on('ready', function () {

  console.log('Mosca server is up and running')
  server.authorizeSubscribe = authorizeSubscribe;

});



server.on('clientConnected', function(client) {

    console.log('client connected', client.id); 

});


// fired when a message is received
server.on('published', function(packet, client) {

  console.log('Published', packet.payload);


});





