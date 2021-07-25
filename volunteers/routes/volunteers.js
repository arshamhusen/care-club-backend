const express = require("express");
const { v1: uuidv1 } = require("uuid");
const router = express.Router();
const { User, Volunteers, Donations, Centers } = require("../models");

async function createVolunteer(volunteerData) {
  User.create({
    id: uuidv1().toString(),
    verificationType: volunteerData.verificationType,
    verificationDocURI: volunteerData.verificationDocURI,
    verificationPhotoURI: volunteerData.verificationPhotoURI,
    startTime: volunteerData.startTime,
    endTime: volunteerData.endTime,
    isAvailable: volunteerData.isAvailable,
    isVerified: volunteerData.isVerified,
    CenterId: volunteerData.CenterId,
    UserId: volunteerData.UserId,
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
}

//Inserts new user details into database
router.route("/create").post(async (req, res, next) => {
  const volunteerCreated = await createVolunteer(req.body);
  volunteerCreated
    ? res.status(200).send({ message: "Success" })
    : res.status(404).send({ message: "There was an error" });
});

// UseEffect Screen render - Check volunteer status
router.route("/user/:id").get(async (req, res, next) => {
  const UserId = req.params.id;
  const userIsAVolunteer = await Volunteers.findOne({
    where: {
      UserId: UserId,
    },
  });
  if (!userIsAVolunteer) {
    res.status(404).send({ error: "User is not a volunteer" });
  } else if (userIsAVolunteer.isVerified === false) {
    res.status(200).send({
      isVerified: false,
    });
  } else {
    const showAllDonations = await Donations.findAll({
      where: {
        CenterId: userIsAVolunteer.CenterId,
      },
    });
    res.status(200).send({ isVerified: true, DonationsData: showAllDonations });
  }
});



module.exports = router;
