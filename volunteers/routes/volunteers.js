const express = require("express");
const { v1: uuidv1 } = require("uuid");
const router = express.Router();
const { Users, Volunteers, Donations, Centers } = require("../models");

async function createVolunteer(volunteerData) {
  const newVolunteer = await Volunteers.create({
    uuid: uuidv1().toString(),
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
  return newVolunteer;
}

//Inserts new user details into database
router.route("/create").post(async (req, res, next) => {
  const volunteerCreated = await createVolunteer(req.body);
  volunteerCreated
    ? res.status(200).send({ message: "Success" })
    : res.status(404).send({ message: "There was an error" });
});

router.route("/all").get(async (req, res, next) => {
  const findAllVolunteers = await Volunteers.findAll();
  res.status(200).send(findAllVolunteers);
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
        status: "Accepted"
      },
    });
    const centerInfo = await Centers.findOne({
      where: {
        id: userIsAVolunteer.CenterId,
      },
    });
    // Get the location of the user for each donation and pass it in the response - mapped array
    res.status(200).send({
      isVerified: true,
      DonationsData: showAllDonations,
      CenterName: centerInfo.name,
      VolunteerId: userIsAVolunteer.id,
    });
  }
});

// When donation is accepted by the center --> Accepted
router.route("/acceptDonation/:id").post(async (req, res, next) => {
  const DonationId = req.params.id;
  const { volunteerId } = req.body;
  const acceptDonation = await Donations.update(
    {
      status: "Accepted",
      VolunteerId: volunteerId,
    },
    {
      where: {
        id: DonationId,
      },
    }
  );

  acceptDonation
    ? res.status(200).send({ message: "OK" })
    : res.json(404).send({ error: "An error occured" });
});

// When donation is rejected by the center --> Rejected
router.route("/rejectDonation/:id").post(async (req, res, next) => {
  const DonationId = req.params.id;
  const rejectDonation = await Donations.update(
    {
      status: "Rejected",
    },
    {
      where: {
        id: DonationId,
      },
    }
  );

  rejectDonation
    ? res.status(200).send({ message: "OK" })
    : res.json(404).send({ error: "An error occured" });
});

// When Volunteer Selects a donation Pickup

router.route("/toPickupDonation/:id").post(async (req, res, next) => {
  const DonationId = req.params.id;
  const { volunteerId } = req.body;
  const acceptDonation = await Donations.update(
    {
      status: "On the way to pick up",
      VolunteerId: volunteerId,
    },
    {
      where: {
        id: DonationId,
      },
    }
  );

  acceptDonation
    ? res.status(200).send({ message: "OK" })
    : res.json(404).send({ error: "failed" });
});

// When volunteer picks up the donations

router.route("/pickUpDonation/:id").post(async (req, res, next) => {
  const DonationId = req.params.id;
  const acceptDonation = await Donations.update(
    {
      status: "Picked up",
    },
    {
      where: {
        id: DonationId,
      },
    }
  );

  acceptDonation
    ? res.status(200).send({ message: "OK" })
    : res.json(404).send({ error: "failed" });
});

// When volunteer drops off the donations
router.route("/dropOffDonation/:id").post(async (req, res, next) => {
  const DonationId = req.params.id;
  const { volunteerId } = req.body;
  const acceptDonation = await Donations.update(
    {
      status: "Completed",
    },
    {
      where: {
        id: DonationId,
      },
    }
  );

  // Make a function which add 20 points in the point table - take the volunteer id, find user Id and add 20 points to the table
    const volunteerProfile = await Volunteers.findOne({
      where: {
        uuid: volunteerId
      }
    });

    const userProfile = await Users.findOne({
      where: {
        uuid: volunteerProfile.UserId
      }
    });

    await Users.update({
      points: userProfile.points += 20
    }, {
      where: {
        uuid: volunteerProfile.UserId
      }
    });


  acceptDonation
    ? res.status(200).send({ message: "OK" })
    : res.json(404).send({ error: "failed" });
});

module.exports = router;
