const mongoose = require('mongoose');
const {Schema} = mongoose;

const PropertySchema = new Schema({
    PropertyName: {
        type: String,
    },
    Address: {
        type: String,
    },
    SaleType:{
        type: String,
    },
    Featured: { 
        type: String, 
    },
    Area: { 
        type: Number,
    },
    PropertyType:{
        type: String,
    },
    NeighbourHood:{
        type: String,
    },
    NumofBeds: { 
        type: Number,
    },
    NumofBathrooms: { 
        type: Number,
    },
    Description: { 
        type: String,
    },
    coverImageUrl: {
        type: String,
    },
    imageUrls: [
        {
          type: String // Assuming you're storing image URLs as strings
        }
      ],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('property',PropertySchema)