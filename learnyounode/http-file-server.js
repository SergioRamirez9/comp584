const http = require('http');
const fs = require('fs');

// Create an HTTP server to handle requests
const server = http.createServer((req, res) => {
  // Set the response header to plain text
  res.writeHead(200, { 'content-type': 'text/plain' });

  // Stream the file specified in the command-line argument to the response
  fs.createReadStream(process.argv[3]).pipe(res);
});

// Start the server and listen on the specified port
server.listen(Number(process.argv[2]));

