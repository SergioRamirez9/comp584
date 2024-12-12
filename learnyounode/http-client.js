const http = require('http')
// Perform an HTTP GET request to the provided URL
http.get(process.argv[2], function (res) {
  res.setEncoding('utf8')
  //log each chunk of data
  res.on('data', console.log)
  res.on('error', console.error)
}).on('error', console.error)
