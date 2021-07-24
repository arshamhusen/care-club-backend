const express = require("express");
const { v1: uuidv1 } = require("uuid");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const saltrounds = 10;

async function createUser(body) {
  const newUser = await User.create({
    id: uuidv1().toString(),
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: hashedPassword,
    phone: body.phone,
    address: body.address,
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  return newUser;
}

async function getUser(params) {
  const data = await User.findAll({
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

async function updateUser(body) {
  await User.update(
    {
      email: body.email,
      password: body.password,
      phone: body.phone,
      address: body.address,
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

async function deleteUser(body) {
  await User.destroy({
    where: {
      id: body.id,
    },
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function getAllUsers() {
  const data = await User.findAll().catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  const res = data.map((user) => {
    return user.dataValues;
  });
  return res;
}

async function verifyUser(body) {
  User.update(
    {
      isVerified: true,
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

//Inserts new user details into database
router.route("/create").post(async (req, res, next) => {
  const result = await createUser(req.body);
  res.status(200).send(result);
});

//Retrieves specific user details from database
//TODO: Hide sensitive data such as id and password as these data are only used for backend

// User params in get requests instead of using body - I have changed it
router.route("/profile/:id").get(async (req, res, next) => {
  const result = await getUser(req.params);
  res.send(result[0]);
});

//Updates user details
router.route("/update").post(async (req, res, next) => {
  await updateUser(req.body);
  const result = await getUser(req.body);
  res.status(200).send(result);
});

//Deletes user from database
router.route("/delete").delete(async (req, res, next) => {
  await deleteUser(req.body);
  res.status(200).send("User successfully removed.");
});

//Gets all users existing from database
router.route("/all").get(async (req, res, next) => {
  const result = await getAllUsers();
  res.send(result);
});

//Verifies user -> Changes isVerified value to true
router.route("/verify").post(async (req, res, next) => {
  await verifyUser(req.body);
  const result = await getUser(req.body);
  res.status(200).send(result);
});

module.exports = router;
