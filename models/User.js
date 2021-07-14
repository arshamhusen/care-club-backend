const { v1: uuidv1 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            defaultValue: uuidv1().toString()
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        phone: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
            //Make into Object or represented as string?
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })

    User.associate = models => {
        User.hasMany(models.Donation, {
            onDelete: "cascade", //should cascade or not?
            foreignKey: "userId"
        })
    }

    return User;
}