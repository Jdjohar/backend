const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://katariaesha02:esha00046@cluster0.swwooje.mongodb.net/listing?retryWrites=true&w=majority';
// Set 'strictQuery' option to false to prepare for future changes in Mongoose 7
mongoose.set('strictQuery', false);
// const mongoURI ='mongodb+srv://restro:restro@cluster0.3aqpydj.mongodb.net/restro?retryWrites=true&w=majority'
const mongoDB = async() => {
    mongoose.connect(mongoURI, {useNewUrlParser: true },async (err, result) => {
    if(err) console.log('Some Error -- ', err)
        else { 
             const fetch_data = await mongoose.connection.db.collection("admin");
    console.log("connected");
        }
    })
  
}


module.exports = mongoDB;