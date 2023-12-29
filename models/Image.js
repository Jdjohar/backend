const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  // ... other fields you might need
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
