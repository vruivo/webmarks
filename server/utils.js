// const http = require('http');
// const https = require('https');
const request = require('request');
const fs = require('fs');

module.exports = {
  httpGET: function httpGET(url, callback) {
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

    // request(url, function (error, response, body) {
    //   // console.log('error:', error);
    //   // console.log('statusCode:', response && response.statusCode);
    //   // console.log('body:', body);
    //   callback(error, response, body);
    // });
    request(url, callback);
  },
  downloadFile: function downloadFile(filename, url, callback) {
    console.log("Downloading >> " + url);
    request(url)
    .on('error', function (err) {
      // console.log("error");
      callback(err);
      return;
    })
    .pipe(fs.createWriteStream(filename)
      .on('close', function functionName() {
        // console.log("close fs");
        callback();
        return;
      })
    );
  }
}
