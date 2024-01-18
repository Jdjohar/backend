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
        type: String,
    },
    PropertyType:{
        type: String,
    },
    NeighbourHood:{
        type: String,
    },
    NumofBeds: { 
        type: String,
    },
    NumofBathrooms: { 
        type: String,
    },
    Description: { 
        type: String,
    },
    price: { 
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