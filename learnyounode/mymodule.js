const fs = require('fs')
const path = require('path')
// export the function to do the filtering
module.exports = function (dir, filterStr, callback) {
  //same solution from pervious excercise
  fs.readdir(dir, function (err, list) {
    if (err)
      return callback(err)
    //filter based on the condition
    list = list.filter(function (file) {
      return path.extname(file) === '.' + filterStr
    })
    // null is used so signify no error was reported + the filtered list
    callback(null, list)
  })
}
