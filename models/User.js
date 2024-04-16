// models/User.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
// const Grid = require('gridfs-stream');
// const conn = mongoose.connection;
// Grid.mongo = mongoose.mongo;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  nid: {
    type: String,
    required: false
  },
  dateofbirth: {
    type: String, 
    required: false
  },
  gender: {
    type: String,
    required: true
  },
  userState: {
    type: String,
    required: false
  },
  medpapers: {
    // type: String,
    // required: false
    fileId: mongoose.Schema.Types.ObjectId, // Store GridFS file ID
    filename: String, // Store original filename
    contentType: String, // Store content type (e.g., image/jpeg)
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verified:{ 
    type: Boolean,
    required: false,
  },
  resetPasswordToken: { // This will store the password reset token
    type: String ,
    required: false 
  },  
  resetPasswordExpires: { // This will store the expiry time of the token
    type: Date ,
    required: false 
  },  
  


});

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Initialize GridFS stream
// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db);
// });

// Export User model and GridFS stream
// module.exports = { User, gfs }; 

