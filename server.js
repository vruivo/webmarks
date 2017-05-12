var app = require('express')();
var http = require('http').Server(app);
var wsio = require('socket.io')(http);

const fs = require('fs');

const pageProcessor = require('./server/pageProcessor');

// var express        = require('express');
var bodyParser     = require('body-parser');
    // methodOverride = require('method-override'),
    // errorHandler   = require('errorhandler'),
var morgan         = require('morgan');
    // routes         = require('./backend'),
    // api            = require('./backend/api');
  // data         = require('./test-data');

// var app = module.exports = express();

const CACHEDIR = "./cache";
try {
  fs.mkdirSync(CACHEDIR);
} catch (e) {
  if (e.code !== 'EEXIST')
    throw e;
}

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', 'public');
app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(methodOverride());
// app.use(express.static('.'));

// var env = process.env.NODE_ENV;
// console.log(env);
// if ('development' == env) {
//   app.use(errorHandler({
//     dumpExceptions: true,
//     showStack: true
//   }));
// }
//
// if ('production' == app.get('env')) {
//   app.use(errorHandler());
// }

app.get('/', function(req, res) {
  // res.render(__dirname + '/public/index.html');
  res.sendFile(__dirname + '/index.html');
});

// app.post('/api/add', function(req, res) {
//   console.log(req.body);
//   res.json("data");
//   getUrlInfo(req.body.url);
// });

wsio.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('add', function(data) {
    console.log(data);
    pageProcessor.getUrlInfo(data.url, socket, CACHEDIR);
  });
});

// app.listen(8080);
http.listen(8080);
console.log('Webmarks backend running on port 8080...');
