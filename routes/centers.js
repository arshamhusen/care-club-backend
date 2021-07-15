const express = require('express');
const router = express.Router();
const haversine = require('haversine-distance');

const { Center } = require('../models');


function registerCenter(body){
    Center.create({
        name: body.name,
        address: body.address,
        email: body.email,
        password: body.password
    }).catch(error => {
        if (error){
            console.log(error);
        }
    });
}

function updateDetails(centerId, newDetails){
    Center.update({
        name: newDetails.name,
        address: newDetails.address,
        email: newDetails.email,
        password: newDetails.password
    }, {
        where: {
            uuid: centerId
        }
    }).catch(err => {
        if(err){
            console.log(err);
        }
    })
}

function verifyEmail(centerId){
    Center.update({isEmailVerified: true}, {
        where: {
            uuid: centerId
        }
    })
    .catch(error => {
        if(error){
            console.log(error);
        }
    })
}

function verifyDocs(centerId){
    Center.update({isDocsVerified: true}, {
        where: {
            uuid: centerId
        }
    })
    .catch(error => {
        if(error){
            console.log(error);
        }
    })
}

async function getCenter(centerId){
    const data = await Center.findAll({
        where: {
                uuid: centerId
            }
        })
        .catch(error => {
            if(error){
                console.log(error);
            }
        })

    return data[0].dataValues;
}

async function getAllCenters(){
    const data = await Center.findAll().catch(error => {
        if(error){
            console.log(error);
        }
    });

    const allCentersDetails = data.map(center => center.dataValues);
    return allCentersDetails;
}

//Not tested. REASON: Needs geocoding service via Google API
function calculateDistance(userLat, userLng, centerLat, centerLng){
    const userCoords = { lat: userLat, lng: userLng };
    const centerCoords = { lat: centerLat, lng: centerLng };

    const haversine_km = haversine(userCoords, centerCoords) / 1000;

    return haversine_km;
}

//Not tested. REASON: Needs geocoding service via Google API
async function filterCenters(userLat, userLng){
    const allCenters = await getAllCenters();
    //GEOCODING HERE
    const allCentersDistance = allCenters.map(center => {
        return {...center, distance: calculateDistance(userLat, userLng, centerLat, centerLng)}
    });

    const nearbyCenters = allCentersDistance.filter(center => {
        return center.distance <= 20;
    });

    return nearbyCenters;
}


router.route('/register').post((req, res, next) => {
    registerCenter(req.body);
});

router.route("/update").post((req, res, next) => {
    const updatedDetails = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        password: req.body.password
    }

    updateDetails(req.body.uuid, updatedDetails);
})

router.route("/verify/email").post(async (req, res, next) => {
    await verifyEmail(req.body.uuid);
    res.send("Email verified");
});

router.route("/verify/docs").post(async (req, res, next) => {
    await verifyDocs(req.body.uuid);
    res.send("Docs verified");
})

router.route("/details").get(async (req, res, next) => {
    const centerDetails = await getCenter(req.body.uuid);
    res.send(centerDetails);
});


module.exports = router;