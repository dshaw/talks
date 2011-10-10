var spawn = require('child_process').spawn;

var count = process.argv[2] || 4 // maxes out locally at 82
  , nodes = {
      io: []
    }
  , ioPort = 8881;

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
