const express = require("express");
const { v1: uuidv1 } = require("uuid");
const router = express.Router();
const { Users } = require("../models");

async function createUser(body) {
  const newUser = await Users.create({
    uuid: uuidv1().toString(),
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    address: body.address,
    profileImg: body.profileImg,
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
  return newUser;
}

async function getUser(id) {
  const data = await Users.findAll({
    where: {
      uuid: id,
    },
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
  return data;
}

async function updateUser(uuid, data) {
  Users.update(
    {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      profileImg: data.profileImg,
    },
    {
      where: {
        uuid: uuid,
      },
    }
  ).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function deleteUser(id) {
  const result = await Users.destroy({
    where: {
      uuid: id,
    },
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  return result;
}

async function getAllUsers() {
  const data = await Users.findAll().catch((err) => {
    if (err) {
      console.log(err);
    }
  });

  const res = data.map((user) => {
    return user.dataValues;
  });
  return res;
}

async function updatePhone(userId, phone) {
  Users.update(
    {
      phone: phone,
    },
    {
      where: {
        uuid: userId,
      },
    }
  );
}

async function verifyUser(body) {
  Users.update(
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

async function checkUserExists(data) {
  const result = await Users.findOne({
    where: {
      email: data.email,
    },
  });

  return result;
}

//Inserts new user details into database
router.route("/create").post(async (req, res, next) => {
  const userExists = await checkUserExists(req.body);
  if (!userExists) {
    const userCreated = await createUser(req.body);
    userCreated
      ? res.status(200).send({
          message: `${userCreated.firstName} was resgistered successfully. Please proceed with email verification`,
        })
      : res
          .status(404)
          .send({ error: "There was an error registering the user" });
  } else {
    res.status(404).send({
      error: `There is already an account under ${userExists.email}!`,
    });
  }
});

// User params in get requests instead of using body - I have changed it
router.route("/profile/:id").get(async (req, res, next) => {
  const getUserInfo = await getUser(req.params.id);
  getUserInfo
    ? res.status(200).send(getUserInfo)
    : res.status(404).send({
        error: "There was an error retrieving the information for the user",
      });
});

//Updates user details
router.route("/update/:id").put(async (req, res, next) => {
  const userUpdated = await updateUser(req.params.id, req.body);
  res.status(200).send({ message: "The user was updated successfully" });
});

//Deletes user from database
router.route("/delete/:id").delete(async (req, res, next) => {
  const userDeleted = await deleteUser(req.params.id);
  res.status(200).send({ message: "User successfully removed." });
});

//Gets all users existing from database
router.route("/all").get(async (req, res, next) => {
  const result = await getAllUsers();
  res.send(result);
});

// Change user phone number
// Upload a profile picture
router.route("/updatePhone/:id").post(async (req, res, next) => {
  const updateUserPhone = updatePhone(req.params.id, req.body.phone);
  updateUserPhone
    ? res.status(200).send({ message: "Phone number was updated successfully" })
    : res
        .status(404)
        .send({ error: "There was an error updatinng the phone number" });
});

// login function
router.route("/loginGetInfo").post(async (req, res, next) => {
  const userInfo = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  res.status(200).send(userInfo);
});

module.exports = router;
