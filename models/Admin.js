const mongoose = require('mongoose');
const {Schema} = mongoose;

const AdminSchema = new Schema({
    email:{
        type: String,
    },
    password:{
        type:String,
    },
});

module.exports = mongoose.model('admin',AdminSchema)