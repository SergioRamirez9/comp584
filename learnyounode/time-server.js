const net = require('net');

// Pads single-digit numbers with a leading zero
function padZero(num) {
  return (num < 10 ? '0' : '') + num;
}

// Generates the current date and time in 'YYYY-MM-DD HH:mm' format
function getTime() {
  const now = new Date();
  return (
    now.getFullYear() + '-' +
    padZero(now.getMonth() + 1) + '-' +
    padZero(now.getDate()) + ' ' +
    padZero(now.getHours()) + ':' +
    padZero(now.getMinutes())
  );
}

// Creates a server that sends the current time and closes the connection
const server = net.createServer((conn) => {
  conn.end(getTime() + '\n');
});

// Start listening on the port provided as a command-line argument
server.listen(Number(process.argv[2]));

