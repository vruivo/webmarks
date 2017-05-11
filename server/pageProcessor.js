const utils = require('./utils');

module.exports = {
  getUrlInfo
}

function getUrlInfo(url, client_socket) {
  const http = require('http');
  const https = require('https');
  const request = require('request');
  console.log(url);


  utils.httpGET(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    console.log("----");

    var page = getPageDetails(body);

    // base url
    // console.log(url);
    var url_start = url.indexOf('//') + 2;
    // console.log(url.substring(url_start, url.indexOf('/', url_start)));
    page.base_url = url.substring(url_start, url.indexOf('/', url_start));
    page.url = url;
    console.log(page);
    // client_socket.emit('new', page);

    getFavicon({
      filename: page.base_url,
      favicon_url: page.favicon,
      base_url: page.base_url
    }, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
    });

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
  var data = {};

  // title
  var start_tag = '<title>';
  var end_tag = '</title>';
  var start_index = html.indexOf(start_tag) + start_tag.length;
  var end_index = html.indexOf(end_tag);

  if (start_index != -1 && end_index != -1) {
    // console.log(html.substring(start_index, end_index));
    data.title = html.substring(start_index, end_index);
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
  // console.log(favicon_href);
  data.favicon = favicon_href;
  // NOTE: some sites have multiple favicons with different sizes
  //            (must be 16x16 pixels or 32x32 pixels)
  //       the href can be absolute or relative
  //       the favicon can also be 'hardcoded' in /favicon.ico

  return data;
}

function getFavicon(data_obj, callback) {
  var filename = data_obj.filename;
  var url = data_obj.favicon_url;
  var base_url = data_obj.base_url;
console.log("cenas");
  if (url[0] === '/' && url[0] === '/') {
    utils.downloadFile(filename, "https:" +url);
  }
  else {
    console.log("boing-----------");
    console.log(url);
  }
}
