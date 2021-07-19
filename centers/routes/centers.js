const express = require("express");
const uniqId = require("uniqid");
const router = express.Router();

const { Center } = require("../models");

async function createCenter(body){
    const newCenter = await Center.create(
        {
            id: uniqId().toString(),
            name: body.name,
            description: body.description,
            address: body.address,
            latitude: body.latitude,
            longitude: body.longitude,
            email: body.email,
            password: body.password,
            profileImg: body.profileImg
        }
    )
    .catch(err => {
        if(err){
            console.log(err);
        }
    });

    return newCenter;
};

async function getCenter(body){
    const data = await Center.findAll({
        where: {
            id: body.id
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
        }
    });

    if(data[0]){
        return data[0].dataValues;
    }
};

async function updateCenter(body){
    await Center.update({
        name: body.name,
        description: body.description,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        email: body.email,
        password: body.password,
        profileImg: body.profileImg
    }, {
        where: {
            id: body.id
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
        }
    })
};

async function deleteCenter(body){
    await Center.destroy({
        where: {
            id: body.id
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
        }
    });
};

async function getAllCenters(){
    const data = await Center.findAll().catch(err => {
        if(err){
            console.log(err);
        }
    });

    const result = data.map(center => {
        return {
            coordinate: {
                latitude: center.latitude,
                longitude: center.longitude
            },
            title: center.name,
            description: center.description,
            image: center.profileImg
        }
    });

    return result;
}

//Inserts new center into database
router.route("/create").post((async (req, res, next) => {
    const result = await createCenter(req.body);
    res.status(200).send(result);
}));

//Retrieves a specific center details
//TODO: Hide sensitive data such as id and password as these data are only used for backend
router.route("/profile").get(async (req, res, next) => {
    const result = await getCenter(req.body);
    res.send(result);
});

//Updates center details
router.route("/update").post(async (req, res, next) => {
    await updateCenter(req.body);
    const result = await getCenter(req.body);
    res.status(200).send(result);
});

//Deletes center from database
router.route("/delete").delete(async (req, res, next) => {
    await deleteCenter(req.body);
    res.status(200).send("Center successfully removed.");
});

//Gets all existing centers (Used for map function)
router.route("/all").get(async (req, res, next) => {
    const result = await getAllCenters();
    res.send(result);
});

module.exports = router;