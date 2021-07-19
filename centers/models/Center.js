const { v1: uuidv1 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
    const Center = sequelize.define("Center", {
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuidv1().toString()
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      address: {
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
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isDocsVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
  
    Center.associate = models => {
      Center.hasMany(models.Donation, {
        onDelete: "cascade",
        foreignKey: "centerId"
      })
    }

    return Center;
  };
  