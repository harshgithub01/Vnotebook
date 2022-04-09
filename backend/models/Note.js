const mongoose = require('mongoose');
const {Schema} = mongoose;
const NotesSchema = new Schema({
  user:{
             type:mongoose.Schema.Types.ObjectId,
             ref:'user'
  } ,
 title:
 {
     type:String,
     reuired: true
 },
 
 description:
 {
    type:String,
    reuired: true
 },
 tag:
 {
    type:String,
    default:"General"
 
 },
 date:
 {
     type:Date,
     default:Date.now
 }
  });
  module.exports = mongoose.model('notes', NotesSchema);