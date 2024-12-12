const fs = require('fs')
const path = require('path')

//directly get the arguement for the file dir
var folder = process.argv[2];
// used to match a period + the desired extension
var targetExtension = '.' + process.argv[3];

fs.readdir(folder, function(err, filesToRead){
    //iterate the files in the dir
    filesToRead.forEach(function(file){
        //if the type matches the extension then log it
        if(path.extname(file) == targetExtension){
            console.log(file);
        }
    })
})


