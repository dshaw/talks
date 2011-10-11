var spawn = require('child_process').spawn;

var count = process.argv[2] || 4 // maxes out locally at ~82
  , nodes = {
        announce: []
      , io: []
    }
  , ioPort = 8881;

// announce data server
nodes.announce.push(spawn('node', ['data.js']));
console.log(
    'announce'
  , 'pid:', nodes.announce[0].pid
);

// socket.io instances
for (var i=0; i<count; i++) {
  var port = ioPort+i
    , nodeId = i+1;
  nodes.io[i] = spawn('node', ['app.js', port, nodeId]);
  console.log(
      'io'
    , 'nodeId:', nodeId
    , 'port:', port
    , 'pid:', nodes.io[i].pid
  );
}
