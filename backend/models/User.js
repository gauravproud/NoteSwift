const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
  });

// These indexes are for duplicacy removal
  const User = mongoose.model('user', UserSchema);
//   -- Not needed as we will use findone in auth
//   User.createIndexes();
  module.exports = User;