var express        = require('express'),
  bodyParser     = require('body-parser'),
    // methodOverride = require('method-override'),
    // errorHandler   = require('errorhandler'),
  morgan         = require('morgan');
    // routes         = require('./backend'),
    // api            = require('./backend/api');
  // data         = require('./test-data'),
  // data2        = require('./test-data2');

var app = module.exports = express();

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(methodOverride());
// app.set('views', 'public');
// app.use(express.static('src'));
// app.use(express.static('.'));
// app.use('/build', express.static('public'));

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

app.post('/api/add', function(req, res) {
  console.log(req.body);
  res.json("data");
  getUrlInfo(req.body.url);
});
//
// app.get('/api/data/boards', function(req, res) {
//   res.json(data2.boards);
// });
// app.get('/api/data/lists', function(req, res) {
//   res.json(data2.lists);
// });
// app.get('/api/data/items', function(req, res) {
//   res.json(data2.items);
// });
// app.post('/api/data/lists', function(req, res) {
//   // console.log(req.body);
//   var list_ids = req.body.lists;
//   var res_data =[];
//
//   if (list_ids && list_ids.length) {
//     res_data = data2.lists.filter(function(val){
//       return (list_ids.indexOf(val.id) !== -1);
//     });
//   }
//
//   res.json(res_data);
// });
//
// app.post('/api/data/items', function(req, res) {
//   // console.log(req.body);
//   var items_ids = req.body.items;
//   var res_data =[];
//
//   if (items_ids && items_ids.length) {
//     res_data = data2.items.filter(function(val){
//       return (items_ids.indexOf(val.id) !== -1);
//     });
//   }
//
//   res.json(res_data);
// });

app.listen(8080);
console.log('Webmarks backend running on port 8080...');


function getUrlInfo(url) {
  const http = require('http');
  const https = require('https');
  const request = require('request');
  console.log(url);

  // return https.get(url, function(response) {
  //       // Continuously update stream with data
  //       var body = '';
  //       response.on('error', function(d) {
  //           console.log(d);
  //       });
  //       response.on('data', function(d) {
  //           body += d;
  //       });
  //       response.on('end', function() {
  //           // Data reception is done, do whatever with it!
  //           var parsed = JSON.parse(body);
  //           // callback({
  //           //     email: parsed.email,
  //           //     password: parsed.pass
  //           // });
  //           console.log(parsed);
  //       });
  //   }).on('error', (e) => {
  //     console.error(`Got error: ${e.message}`);
  //     console.log(e);
  //   });

  // http.get('http://nodejs.org/dist/index.json', (res) => {
  //   const { statusCode } = res;
  //   const contentType = res.headers['content-type'];
  //
  //   let error;
  //   if (statusCode !== 200) {
  //     error = new Error(`Request Failed.\n` +
  //                       `Status Code: ${statusCode}`);
  //   } else if (!/^application\/json/.test(contentType)) {
  //     error = new Error(`Invalid content-type.\n` +
  //                       `Expected application/json but received ${contentType}`);
  //   }
  //   if (error) {
  //     console.error(error.message);
  //     // consume response data to free up memory
  //     res.resume();
  //     return;
  //   }
  //
  //   res.setEncoding('utf8');
  //   let rawData = '';
  //   res.on('data', (chunk) => { rawData += chunk; });
  //   res.on('end', () => {
  //     try {
  //       const parsedData = JSON.parse(rawData);
  //       console.log(parsedData);
  //     } catch (e) {
  //       console.error(e.message);
  //     }
  //   });
  // }).on('error', (e) => {
  //   console.error(`Got error: ${e.message}`);
  //   console.log(e);
  // });

  // const readline = require('readline');
  // var lineReader = require('readline').createInterface({
  //   input: request(url, function (error, response, body) {
  //     console.log('error:', error); // Print the error if one occurred
  //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //     // console.log('body:', body); // Print the HTML for the Google homepage.
  //   })
  // });
  //
  // lineReader.on('line', (input) => {
  //   console.log(`Received: ${input}`);
  // });

  request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    console.log("----");
    // base url
    // console.log(url);
    var url_start = url.indexOf('//') + 2;
    console.log(url.substring(url_start, url.indexOf('/', url_start)));

    getPageDetails(body);
  })
}

// function getHtmlTag(html, tag) {
//   var start_tag = '<' + tag + '>';
//   var end_tag = '</' + tag + '>';
//   var start_tag_index = html.indexOf(start_tag) + start_tag.length;
//   var end_tag_index = html.indexOf(end_tag);
//
//   console.log(start_tag_index);
//   console.log(end_tag_index);
//
//   console.log(html.substring(start_tag_index, end_tag_index));
// }

function getPageDetails(html) {
  // title
  // getHtmlTag(body, "title");
  var start_tag = '<title>';
  var end_tag = '</title>';
  var start_index = html.indexOf(start_tag) + start_tag.length;
  var end_index = html.indexOf(end_tag);

  if (start_index != -1 && end_index != -1) {
    console.log(html.substring(start_index, end_index));
  }

  // favicon
  start_tag = '<link';
  end_tag = '>';
  start_index = end_index = 0;
  var favicon_href;

  while (start_index !== -1 && end_index !== -1) {  // search for link tags
    start_index = html.indexOf(start_tag, end_index);
    end_index = html.indexOf(end_tag, start_index);

    if (start_index !== -1 && end_index !== -1) { // link tag found
      var link = html.substring(start_index, end_index);

      if (link.search(/rel="(shortcut )?icon"/i) !== -1) {  // check if is favicon
        start_index = link.indexOf('href="') + 6;
        end_index = link.indexOf('"', start_index);

        if (start_index !== -1 && end_index !== -1) {
          favicon_href = link.substring(start_index, end_index);
        }

        break;
      }
    }
  }
  console.log(favicon_href);
  // NOTE: some sites have multiple favicons with different sizes
  //            (must be 16x16 pixels or 32x32 pixels)
  //       the href can be absolute or relative
  //       the favicon can also be 'hardcoded' in /favicon.ico

}
