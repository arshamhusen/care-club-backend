const express = require('express');
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

const { Donation } = require('../models')

async function createDonation(body){
    const donation = {
        id: uuidv4().toString(),
        name: body.name,
        description: body.description,
        isPerishable: body.isPerishable,
        quantity: body.quantity,
        status: body.status,
        centerId: body.centerId,
        userId: body.userId
    }

    const data = await Donation.create(donation).catch(error => {
        if(error){
            console.log(error);
        }
    });

    return data;
};

async function getUserDonations(userId){
    const data = await Donation.findAll({
        where: {
            userId: userId
        }
    })
    .catch(error => {
        if(error){
            console.log(error);
        }
    });

    const allUserDonations = data.map(d => d.dataValues);
    return allUserDonations;
};

async function getCenterDonations(centerId){
    const data = await Donation.findAll({
        where: {
            centerId: centerId
        }
    })
    .catch(error => {
        if(error){
            console.log(error);
        }
    });

    const allCenterDonations = data.map(d => d.dataValues);
    return allCenterDonations;
};

async function getDonation(body){
    const data = await Donation.findAll({
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

function updateStatus(body){
    Donation.update({
        status: body.status
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
}


router.route("/create").post(async (req, res, next) => {
    const result = await createDonation(req.body);
    res.status(200).send(result);
});

router.route("/view/user").get(async (req, res, next) => {
    const donations = await getUserDonations(req.body.uuid);
    res.send(donations);
});

router.route("/view/center").get(async (req, res, next) => {
    const donations = await getCenterDonations(req.body.uuid);
    res.send(donations);
});

router.route("/update/status").post(async (req, res, next) => {
    await updateStatus(req.body);
    const result = await getDonation(req.body);
    res.status(200).send(result);
})

module.exports = router;