const utils = require('./utils');

module.exports = {
  getUrlInfo
}

function getUrlInfo(url, client_socket, cache_dir) {
  console.log("--");
  console.log(url);

  if (!cache_dir) cache_dir = ".";

  utils.httpGET(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    console.log("----");

    if (! error) {
      var page = getPageDetails(body);

      // base url
      page.base_url = getBaseUrl(url);
      page.url = url;

      console.log(page);

      getFavicon({
        filename: cache_dir + "/" + page.base_url + ".ico",
        favicon_url: page.favicon,
        base_url: page.base_url
      }, function (error) {
        if (error) {
          // TODO: should just get a default favicon
          client_socket.emit('newfail', page);
        }
        else {
          page.favicon = page.base_url + ".ico";
          client_socket.emit('new', page);
        }
      });
    }
    else {
      client_socket.emit('newfail', page);
    }

  })
}

function getBaseUrl(full_url) {
  // base url == hostname
  var url_start = full_url.indexOf('//') + 2;
  var base_url = full_url.substring(url_start, full_url.indexOf('/', url_start));
  return base_url;
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

      if (link.search(/rel="?(shortcut )?icon"?/i) !== -1) {  // check if is favicon
        start_index = link.indexOf('href=') + 5;
        if (link[start_index] === '"')
          start_index++;

        end_index = link.indexOf(' ', start_index);
        if (end_index === -1)
          end_index = link.length;  // does not include end tag
        if (link[end_index-1] === '"')
          end_index--;

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
  var favicon_url = data_obj.favicon_url;
  var base_url = data_obj.base_url;

  // TODO: search cache first

  if (! favicon_url) {
    callback("no favicon url");
    return;
  }

  // favicon url processors/interpreters
  if (favicon_url[0] === '/' && favicon_url[1] === '/') {
    utils.downloadFile(filename, "https:" +favicon_url, function functionName(err) {
      // console.log(err);
      callback(err);
    });
  }
  else if (favicon_url[0] === '/') {
    utils.downloadFile(filename, "https://" + base_url + favicon_url, function functionName(err) {
      callback(err);
    });
  }
  else {
    console.log("boing-----------");
    console.log(favicon_url);
  }
}
