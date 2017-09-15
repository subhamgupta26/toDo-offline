var mongoose     = require('mongoose');
var personSchema = mongoose.Schema({
   title: String,
   description : String
   });
module.exports = mongoose.model("Person", personSchema);