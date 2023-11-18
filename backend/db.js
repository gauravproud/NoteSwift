const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/inotebook"

// This is the right method
const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    .then(success=> console.log("Connected"))
    .catch(err=>console.log(err.message));
}

module.exports = connectToMongo;