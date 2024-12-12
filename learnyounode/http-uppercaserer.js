const http = require('http');
//npm install through2-map
const map = require('through2-map');

// Create an HTTP server to handle requests
const server = http.createServer((req, res) => {
  // Respond with a message if the request is not a POST
  if (req.method !== 'POST')
    return res.end('send me a POST\n');

  // Transform the request body to uppercase and send it back in the response
  req.pipe(map((chunk) => {
    return chunk.toString().toUpperCase();
  })).pipe(res);
});

// Start the server and listen on the specified port
server.listen(Number(process.argv[2]));

