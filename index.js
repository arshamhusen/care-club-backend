
// server.js
 const express = require('express');
 const app = express();
 const port = 8080;
 const cors = require("cors");
 

 // Models and Database
 const db = require("./models")
 
 // Middlewares 
  app.use(express.json({limit: "50mb"}));
  app.use(express.urlencoded({limit: "50mb"}))
 
 // start the server
 db.sequelize.sync().then((req) => {
  app.listen(port, function() {
    console.log('Sever running on', port);
  })
 })

 //Routers
 const CenterRouter = require("./routes/centers");
 const UserRouter = require("./routes/users");
 const DonationRouter = require("./routes/donations");

 app.use("/centers", CenterRouter);
 app.use("/users", UserRouter);
 app.use("/donations", DonationRouter);
 
 // route our app
 app.get('/', function(req, res) {
  res.send('hello world!');
});