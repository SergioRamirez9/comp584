const http = require('http')
//npm install bl
const bl = require('bl')
// Make an HTTP GET request to the URL from command-line arguments
http.get(process.argv[2], function (res) {
  // Pipe the response to the 'bl' buffer
  res.pipe(bl(function (err, data) {
    // If an error occurs, log it and exit
      if (err) {
          return console.error(err);
      }
    // Convert the buffered data to a string
    data = data.toString();
    console.log(data.length);
    console.log(data);
  }))
})

