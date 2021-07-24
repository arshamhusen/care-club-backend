module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
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
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    profileImg: {
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
