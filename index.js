const express = require('express')
const app = express()
const port = 3001
const mongoDB = require("./db")
const nodemailer = require('nodemailer');
var path = require('path');
mongoDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://listing-project-xwf6.vercel.app");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Include OPTIONS method
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Include OPTIONS method
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Origin, X-Requested-With, Accept'
  );
  next();
  // Handle preflight request
  // if (req.method === 'OPTIONS') {
  //   res.sendStatus(200); // Respond with OK status for OPTIONS request
  // } else {
  //   next();
  // }
});

// app.use((req, res, next) => {
//   // res.setHeader("Access-Control-Allow-Origin","https://restroproject.onrender.com");
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, Origin, X-Requested-With, Accept'
//   );
//   next();
// });

// Define the default location for images
// app.use(express.static(path.join(__dirname, '/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/images', express.static(__dirname + '/uploads'));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())
app.use('/api', require("./Routes/CreateUser"));
// app.use('/api', require("./Routes/Createcategory"));
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));
app.use('/api', require("./Routes/TestApi"));
app.use('/api', require("./Routes/ForgotPassword"));

app.listen(port, () => {
  console.log(`Server  listening on port ${port}`)
})