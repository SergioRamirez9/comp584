const http = require('http');
const url = require('url');

// Get the port from command-line arguments
const port = process.argv[2];

// Extracts the time in 'hour', 'minute', and 'second' format
const getTimeParts = (time) => ({
  hour: time.getHours(),
  minute: time.getMinutes(),
  second: time.getSeconds(),
});

// Extracts the time in Unix timestamp format
const getUnixTime = (time) => ({ unixtime: time.getTime() });

// Handles API endpoint routing
const handleRoute = (parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/api/parsetime':
      return getTimeParts(new Date(parsedUrl.query.iso));
    case '/api/unixtime':
      return getUnixTime(new Date(parsedUrl.query.iso));
    default:
      return { error: 'Invalid endpoint' };
  }
};

// Create and start the server
const server = http.createServer((req, res) => {
  // Check if the request method is GET
  if (req.method === 'GET') {
    // Set the response header to JSON
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // Parse the URL with query parameters
    const parsedUrl = url.parse(req.url, true);

    // Handle the appropriate route and send the response
    res.end(JSON.stringify(handleRoute(parsedUrl)));
  } else {
    // Respond with 405 Method Not Allowed for non-GET requests
    res.writeHead(405);
    res.end();
  }
});

// Listen on the specified port
server.listen(+port, () => {
  console.log('Server listening on http://localhost:%s', port);
});

