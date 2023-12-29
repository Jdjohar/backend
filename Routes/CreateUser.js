const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");
const Admin = require('../models/Admin');
const Property = require('../models/Property');
const ContactInfo = require('../models/ContactInfo');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Save files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});


const upload = multer({ storage: storage });

router.post("/upload", upload.array('images', 10), (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path); // assuming you're saving file paths

        res.json({ Success: true, imageUrls: imageUrls });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ Success: false, error: "Failed to upload images" });
    }
});

router.post('/upload-cover', upload.single('coverImage'), (req, res) => {
    try {
      const coverImageUrl = req.file.path; // Assuming you're storing cover image URL
      res.json({ Success: true, coverImageUrl });
    } catch (error) {
      console.error('Error uploading cover image:', error);
      res.status(500).json({ Success: false, error: 'Failed to upload cover image' });
    }
  });
  
router.post("/login", [
    body('email').exists(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
        let userdata = await Admin.findOne({ email });
        if (!userdata) {
            return res.status(400).json({ errors: "Login with correct details " });
        }

        const pwdCompare = await bcrypt.compare(req.body.password, userdata.password)
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Login with correct details" });
        }
        const data = {
            user:{
                id:userdata.id
            }
        }

        const authToken = jwt.sign(data, jwrsecret)
        res.json({ Success: true,authToken:authToken,userid: userdata.id})
    }
    catch (error) {
        console.log(error);
        res.json({ Success: false })
    }
});

router.post("/addproperty",
    [
        body('PropertyName').isLength(),
        body('Address').isLength({min:3}),
        body('SaleType').isLength(),
        body('Featured').isLength(),
        body('Area').isNumeric(),
        body('PropertyType').isLength(),
        body('NeighbourHood').isLength(),
        body('NumofBeds').isNumeric(),
        body('NumofBathrooms').isNumeric(),
        body('Description').isLength(),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            Property.create({
                PropertyName: req.body.PropertyName,
                Address: req.body.Address,
                SaleType: req.body.SaleType,
                Featured: req.body.Featured,
                Area: req.body.Area,
                PropertyType: req.body.PropertyType,
                NeighbourHood: req.body.NeighbourHood,
                NumofBeds: req.body.NumofBeds,
                NumofBathrooms: req.body.NumofBathrooms,
                Description: req.body.Description,
                imageUrls: req.body.imageUrls,
                coverImageUrl: req.body.coverImageUrl,
            })
            res.json({ 
                Success: true,
                message: "Congratulations! Your Property has been successfully added! "
            })
        }
        catch (error) {
            console.log(error);
            res.json({ Success: false })
        }
    });

    // Fetch all properties
    router.get('/getproperties', async (req, res) => {
        try {
            const properties = await Property.find();
    
            // Check if all properties have Featured set to 'no'
            const allFeaturedNo = properties.every(property => property.Featured === 'no');
    
            if (allFeaturedNo) {
                return res.json({ message: "No featured properties available." });
            }
    
            const filteredProperties = properties.filter(property => property.Featured === 'yes');
    
            const modifiedProperties = filteredProperties.map(property => ({
                ...property._doc,
                imageUrls: property.imageUrls.map(url => url.replace(/\\/g, '/'))
            }));
    
            res.json(modifiedProperties);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Inside your backend route
    // router.post('/getpropertiesbyNeighbourHood', async (req, res) => {
    //     try {
    //       const { neighborhoods } = req.body; // Accessing neighborhoods from request body
    //       const properties = await Property.find({ NeighbourHood: { $in: neighborhoods } });
    //       res.json(properties);
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //   });

    router.post('/getpropertiesbyNeighbourHood', async (req, res) => {
        try {
          const { neighborhoods, propertyType, NumofBeds, NumofBathrooms } = req.body;
      
          // Define a filter object based on selected property type
          const filter = {
            NeighbourHood: { $in: neighborhoods }
          };
      
          // Check if propertyType is selected and add it to the filter
          if (propertyType && propertyType !== 'Select property type') {
            filter.PropertyType = propertyType;
          }

          // Check for NumofBeds condition
        if (NumofBeds && NumofBeds !== 'Select beds') {
            const beds = parseInt(NumofBeds.split('+')[0]); // Extract the number from '+ beds'
            filter.NumofBeds = { $gte: beds }; // Filter where NumofBeds is greater than or equal to selected value
        }
  
        // Check for NumofBathrooms condition
        if (NumofBathrooms && NumofBathrooms !== 'Select bathrooms') {
            const bathrooms = parseInt(NumofBathrooms.split('+')[0]); // Extract the number from '+ bathrooms'
            filter.NumofBathrooms = { $gte: bathrooms }; // Filter where NumofBathrooms is greater than or equal to selected value
        }
      
          const properties = await Property.find(filter);
          res.json(properties);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });

      // Endpoint to submit contact information
      router.post('/submit-contact-info', async (req, res) => {
        try {
          const { name, title, email, address, number } = req.body;
          let existingContactInfo = await ContactInfo.findOne();
      
          if (!existingContactInfo) {
            // If no existing contact info, create a new one
            const newContactInfo = new ContactInfo({ name,title,email, address, phoneNumber: number });
            const savedContactInfo = await newContactInfo.save();
            return res.status(201).json(savedContactInfo);
          } else {
            // If contact info exists, update it
            existingContactInfo.name = name;
            existingContactInfo.title = title;
            existingContactInfo.email = email;
            existingContactInfo.address = address;
            existingContactInfo.phoneNumber = number;
      
            const updatedContactInfo = await existingContactInfo.save();
            return res.status(200).json(updatedContactInfo);
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
      
      
      router.get('/get-contact-info', async (req, res) => {
        try {
          const contactInfo = await ContactInfo.find(); // Fetch all contact information
          res.status(200).json(contactInfo);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      // Route to get property details by ID
      router.get('/property/:id', async (req, res) => {
    try {
      const property = await Property.findById(req.params.id); // Find property by ID in the database
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.status(200).json(property);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/update-sale-type/:id', async (req, res) => {
    try {
      const propertyId = req.params.id;
      const { newSaleType } = req.body;
  
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      property.SaleType = newSaleType;
      await property.save();
  
      res.json({ Success: true, message: 'SaleType updated successfully' });
    } catch (error) {
      res.status(500).json({ Success: false, error: error.message });
    }
  });
  
      
module.exports = router;