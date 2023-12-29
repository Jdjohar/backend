const mongoose = require('mongoose');
const {Schema} = mongoose;

const ContactInfoSchema = new Schema({
      name: {
        type: String,
      },
      title: {
        type: String,
      },
      email: {
        type: String,
      },
      address: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
});

module.exports = mongoose.model('ContactInfo',ContactInfoSchema)