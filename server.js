var express = require('express');
var app = express();
var http = require('http').Server(app);
var sio = require('socket.io')(http);
var session = require('express-session');
const utils = require('./server/utils');

const fs = require('fs');
var fsconstants = fs.constants || fs;
const pageProcessor = require('./server/pageProcessor');
var bodyParser     = require('body-parser');

var morgan         = require('morgan');


const CACHEDIR = "./cache";
try {
  fs.mkdirSync(CACHEDIR);
} catch (e) {
  if (e.code !== 'EEXIST')
    throw e;
}


app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sessionMid = session({ secret: 'example' });  // dev only !
app.use(sessionMid);

function checkAuth(req, res, next) {
  if (!req.session || !req.session.user_id) {
    // res.send('You are not authorized to view this page');
    res.redirect('/login');
  } else {
    next();
  }
}

// https://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local

app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user === 'myuser' && post.password === 'mypassword') {
    req.session.user_id = 123;
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

  fs.access(filepath, fsconstants.F_OK | fsconstants.R_OK, (err) => {
    if (!err)
      res.sendFile(filepath);
    else {
      res.send("no file");
    }
  });

});


sio.use(function(socket, next){
  sessionMid(socket.request, socket.request.res, next);
});

sio.on('connection', function(socket) {
  // console.log('a user connected');
  // console.log(socket.request.session);

  if (socket.request.session.user_id == undefined) {
    socket.disconnect();
    return;
  }

  socket.on('add', function(data) {
    pageProcessor.getUrlInfo(data.url, socket, CACHEDIR)
    .then(function(data) {
      data.filename = CACHEDIR + "/" + data.base_url + ".ico";
      return pageProcessor.getFavicon(data);
    })
    .then(function (data) {
      data.icon = data.base_url + ".ico";
      delete data.filename;
      delete data.favicon;

      utils.dbSaveFav(socket.request.session.user_id, data);

      socket.emit('new', data);
    })
    .catch(function(err) {
      console.log('err:', err);
      socket.emit('newfail', err);
    });
  });

  socket.on('getfavs', function(data) {
    var favs = utils.dbGetFavs(socket.request.session.user_id);
    socket.emit('favslist', favs);
  });

});


// app.listen(8080);
http.listen(8080);
console.log('Webmarks backend running on port 8080...');

// TODO: web - show error msg
// TODO: polish web & code
