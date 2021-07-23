const { v1: uuidv1 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuidv1().toString(),
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // password: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    // isVerified: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Donations, {
      onDelete: "cascade", //should cascade or not? Should be because without foreign key there is no access either way
      foreignKey: "UserId",
    });
  };

  return Users;
};
