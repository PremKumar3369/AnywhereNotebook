const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");



const UserSchema = new Schema({
  title : {
    type: String,
    required : True
  },
  description: {
    type : String,
    required : True,
    unique : True
},
  tag : {
    type : String,
    default : "Genreal"
  },
  date : {
    type : Date,
    default : Date.now
  }
  }
);
module.exports = mongoose.model("Notes", NotesSchema);