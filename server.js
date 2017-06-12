var express = require('express');
var app = express();
var http = require('http').Server(app);
var wsio = require('socket.io')(http);
var session = require('express-session');

const fs = require('fs');

const pageProcessor = require('./server/pageProcessor');

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(bodyParser.text());
// app.use(methodOverride());

app.use(session({ secret: 'example' }));  // dev only

function checkAuth(req, res, next) {
  if (!req.session || !req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

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

// https://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local


app.post('/login', function (req, res) {
  var post = req.body;
  console.log(">", req.body);
  if (post.user === 'myuser' && post.password === 'mypassword') {
    req.session.user_id = 123;
    console.log("ssadsadasd");
    res.redirect('/');
  } else {
    res.send('Bad user/pass');
  }
});

app.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});

app.use(express.static('client/public', {extensions: ['html']}));
app.use(checkAuth, express.static('client/private', {extensions: ['html']}));

app.get('/icon/:id', function(req, res) {
  var filepath = __dirname + '/cache/' + req.params.id;

  fs.access(filepath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    // console.log(err ? 'no access!' : 'can read/write');
    if (!err)
      res.sendFile(filepath);
    else {
      res.send("no file");
    }
  });

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
