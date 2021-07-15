const express = require('express');
const router = express.Router();
const { CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');

const { User } = require("../models");
const CognitoUserPool = require('../src/cognito-userpool');


function registerUser(body){
    const newUser = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        phone: body.phone,
        address: body.address
    };

    User
    .create(newUser)
    .catch(error => {
        if(error){
            console.log(error);
        }
    })
}

function updateUserDetails(userId, newDetails){
    User.update({
        password: newDetails.password,
        phone: newDetails.phone,
        address: newDetails.address
    }, {
        where: {
            uuid: userId
        }
    })
    .catch(error => {
        if(error){
            console.log(error);
        }
    })
}

async function getUserDetails(userId){
    const data = await User.findAll({
        where: {
            uuid: userId
        }
    })
    .catch(error => {
        if(error){
            console.log(error);
        }
    });

    return data[0].dataValues;
}

//Not tested. REASON: Needs to sync with front end process/setup Cognito
router.route('/login').post((req, res, next) => {
    const user = new CognitoUser({
        Username: req.body.email,
        UserPool: CognitoUserPool
    })

    const authDetails = new AuthenticationDetails({
        Username: req.body.email,
        Password: req.body.password
    })

    user.authenticateUser(authDetails, {
        onSuccess: data => {
            console.log(`Authentication Success - ${data}`);
        },
        onFailure: error => {
            console.log(`Authentication Failed - ${error}`);
        },
        newPasswordRequired: data => {
            console.log(`New Password Required - ${data}`)
        }
    })
})

//Not tested. REASON: Needs to sync with front end process/setup Cognito
router.route('/signup').post((req, res, next) => {
    //Send user email & password to Cognito
    if(req.body.email !== null && req.body.password !== null){
        CognitoUserPool.signUp(req.body.email, req.body.password, [], null, (error, data) => {
            if (error){
                console.log(error);
            }
            console.log(data);
        })
    }
})

router.route('/create').post(async (req, res, next) => {
    await registerUser(req.body);
    res.send(req.body);
});

router.route("/update").post(async (req, res, next) => {
    await updateUserDetails(req.body.uuid, req.body);
    res.send(req.body);
});

router.route("/profile").get(async (req, res, next) => {
    const userDetails = await getUserDetails(req.body.uuid);
    res.send(userDetails);
})



module.exports = router;