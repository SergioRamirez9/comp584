const fs = require('fs')
//This will be the file since 0,1 index are just NODE or the file to be ran
const file = process.argv[2]
//Using the readFile call for async, function needs to be passed as a method call arguement. Notice there is a callback function as an argument for readFile.
fs.readFile(file, function(err, fileContents){
    //Initially did not have error handeling; however, it would be wise to include it
    if (err) {
        return console.log(err)
      }
    const lineCount = fileContents.toString().split('\n').length - 1;
    //console.log triggers faster than the argument can get the complete result
    //console.log(fileContents.toString().split('\n'.length - 1));
    console.log(lineCount);
})
