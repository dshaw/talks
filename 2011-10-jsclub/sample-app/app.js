var path = require('path')
  , connect = require('connect')
  , request = require('request')
  , sio = require('socket.io')
  , RedisStore = sio.RedisStore;

var port = process.argv[2] || 8880
  , id = process.argv[3] || 0
  , delay = process.argv[4] || 800
  , app = connect.createServer(
        connect.bodyParser()
      , connect.static(path.join(__dirname, './'))
      , connect.router(routes)
    )
  , io = sio.listen(app);


io.configure(function () {
 io.set('store', new RedisStore({ nodeId: function () { return id } }));
});

io.sockets.on('connection', function (socket) {
  socket.emit('nodeId', id);

  socket.on('purchase', function (data, fn) {
    console.log(arguments);
    data.timestamp = Date.now();

    setTimeout(function () { // without a delay the transition between purchase and confirm is usually imperceptible
      socket.emit('confirm', data);
      socket.broadcast.emit('activity', data);
    }, delay);
  });

  socket.on('restart', function (data) {
    io.sockets.in('').emit('restart');
  })
});

function routes (app) {
  app.post('/stocks', function(req, res){
    var quote = req.body;
    console.log(req.url, quote);
    io.sockets.in('').emit('quote', quote);
    res.end('stock quote dispatched for ' + quote.symbol);
  });
}

app.listen(port);

app.on('listening', function () {
  console.log('listening on :', app.address());
});



/* fake data stream */
var symbols = 'THOO GOOF EXIT BOP SDD ALPP RIGM OPPL HPBG'.split(' ');

function dataStream () {
  var n = Math.round(Math.random()*5)
    , data = {
      id: (Math.abs(Math.random() * Math.random() * Date.now() | 0))
    , symbol: symbols[n]
    , price: (Math.random()*1000).toFixed(2)
    , n: n
  };
  request.post({ url: 'http://localhost:'+port+'/stocks', json: data }, function() {});
}

dataStream();
setInterval(dataStream, 5000);
