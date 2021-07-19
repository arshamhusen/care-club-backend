const express = require('express');
const app = express();
const port = process.env.PORT || 8080;


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
const CentersRouter = require("./routes/centers");
app.use("/centers", CentersRouter);
