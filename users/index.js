const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

const db = require("./models");

//Middleware
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb"}));

//Connect to DB & start server
db.sequelize.sync().then((req) => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })    
});

//Routes
const UsersRoute = require("./routes/users");
app.use("/users", UsersRoute);
