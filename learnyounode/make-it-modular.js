const filterFn = require('./mymodule.js')
const dir = process.argv[2]
const filterStr = process.argv[3]

filterFn(dir, filterStr, function (err, list) {
    //Early return as described in the instructions
    if (err){
        return console.error('There was an error:', err)
    }
    //log each file matching the filter
    list.forEach(function (file) {
        console.log(file)
    })
})
