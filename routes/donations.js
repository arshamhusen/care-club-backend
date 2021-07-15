const express = require('express');
const router = express.Router();

const { Donation } = require('../models')

function makeDonation(body){
    const donation = {
        name: body.name,
        description: body.description,
        isPerishable: body.isPerishable,
        quantity: body.quantity,
        status: body.status,
        centerId: body.centerId,
        userId: body.userId
    }

    Donation.create(donation).catch(error => {
        if(error){
            console.log(error);
        }
    })
};

async function getUserDonations(userId){
    const data = await Donation.findAll({
        where: {
            userId: userId
        }
    }).catch(error => {
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
    }).catch(error => {
        if(error){
            console.log(error);
        }
    });

    const allCenterDonations = data.map(d => d.dataValues);
    return allCenterDonations;
}


router.route("/create").post(async (req, res, next) => {
    await makeDonation(req.body);
    res.send(req.body);
});

router.route("/view/user").get(async (req, res, next) => {
    const donations = await getUserDonations(req.body.uuid);
    res.send(donations);
});

router.route("/view/center").get(async (req, res, next) => {
    const donations = await getCenterDonations(req.body.uuid);
    res.send(donations);
})

module.exports = router;