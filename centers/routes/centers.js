const route = require("color-convert/route");
const express = require("express");
const haversine = require("haversine-distance");
const router = express.Router();

const { Centers, Donations } = require("../models");

async function createCenter(body) {
  const newCenter = await Centers.create({
    name: body.name,
    description: body.description,
    address: body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    phone: body.phone,
    email: body.email,
    profileImgURI: body.profileImgURI,
    verificationDocURI: body.verificationDocURI,
    isEmailVerified: body.isEmailVerified,
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  return newCenter;
}

async function checkCenterExists(name, email) {
  const findCenterbyEmail = await Centers.findOne({
    where: {
      name: name,
      email: email,
    },
  });
  return findCenterbyEmail;
}

async function getCenter(params) {
  const data = await Centers.findOne({
    where: {
      id: params.id,
    },
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  return data;
}

async function updateCenter(body) {
  await Centers.update(
    {
      name: body.name,
      description: body.description,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      phone: body.phone,
      email: body.email,
      profileImg: body.profileImg,
    },
    {
      where: {
        id: body.id,
      },
    }
  ).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function deleteCenter(body) {
  await Centers.destroy({
    where: {
      id: body.id,
    },
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function getAllCenters() {
  const data = await Centers.findAll().catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  const result = data.map((center) => {
    return {
      coordinate: {
        latitude: center.latitude,
        longitude: center.longitude,
      },
      address: center.address,
      title: center.name,
      description: center.description,
      image: center.profileImg,
      phone: center.phone,
      email: center.email,
    };
  });

  return result;
}

async function getCenterDonations(params) {
  const donations = await Donations.findAndCountAll({
    where: {
      centerId: params.id,
    },
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  return donations;
}

async function getCenterDonors(params) {
  const donorsCount = await Donations.count({
    where: {
      centerId: params.id,
    },
    distinct: true,
    col: "userId",
  });

  return donorsCount;
}

//Inserts new center into database
router.route("/create").post(async (req, res, next) => {
  const checkIfExist = await checkCenterExists(req.body.name, req.body.email);

  if (checkIfExist) {
    res.status(404).json(`${req.body.name} already exists`);
  } else {
    const result = await createCenter(req.body);
    res.status(200).json(`${req.body.name} is successfully registered`);
  }
});

//Retrieves a specific center details
//TODO: Hide sensitive data such as id and password as these data are only used for backend
router.route("/profile").get(async (req, res, next) => {
  const result = await getCenter(req.body);
  res.send(result);
});

//Updates center details
router.route("/update").put(async (req, res, next) => {
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

// router.post("/allByLocations", async (req, res) => {
//   const centers = await getAllCenters();
// });

// Get center Screen information
router.route("/centerProfileInfo/:id").get(async (req, res) => {
  const CenterInfo = await getCenter(req.params);
  if (CenterInfo) {
    const centerDonations = await getCenterDonations(req.params);
    const centerDonors = await getCenterDonors(req.params);

    const centerProfileData = {
      centerName: CenterInfo.name,
      centerDescription: CenterInfo.description,
      centerAddress: CenterInfo.address,
      centerIsVerified: CenterInfo.centerIsVerified,
      centerProfileImg: CenterInfo.profileImg,
      centerDonationCount: centerDonations.count,
      centerDonorCount: centerDonors,
    };

    res.json(centerProfileData);
  } else {
    res.status(404).json("Something went wrong");
  }
});

router.route("/centersFilterDistance").post(async (req, res) => {
  const { latitude, longitude } = req.body;
  const userCoords = { lat: latitude, lng: longitude };
  const allCenters = await getAllCenters();

  // TODO: Expand range if no centers is found
  const nearbyRange = 8; // Should be also coming from the front end - as users will have the choice of changing it.
  let centersNearby = [];

  for (center of allCenters) {
    const centerCoords = {
      lat: center.coordinate.latitude,
      lng: center.coordinate.longitude,
    };
    const distance = haversine(userCoords, centerCoords) / 1000;

    if (distance <= nearbyRange) {
      centersNearby.push(center);
    }
  }

  res.json(centersNearby);
});

module.exports = router;
