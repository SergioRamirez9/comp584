const http = require('http');
const bl = require('bl');

const responses = [];
// counter for completed requests
let completedRequests = 0;

// Print all responses in the order of the requests
function displayResponses() {
  for (let i = 0; i < 3; i++) {
    console.log(responses[i]);
  }
}

// Perform an HTTP GET request and process the response
function fetchResponse(index) {
  http.get(process.argv[2 + index], (res) => {
    //pipe response so that it cane be converted to a string
    res.pipe(bl((err, data) => {
        if (err) {
            return console.error(err);
        }

      responses[index] = data.toString();
      //keeps track of the count of requests
      completedRequests++;

      if (completedRequests === 3) {
        //print after all are done
        displayResponses();
      }
    }));
  });
}

// Initiate three HTTP GET requests
for (let i = 0; i < 3; i++) {
  fetchResponse(i);
}

