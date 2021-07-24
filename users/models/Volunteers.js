module.exports = (sequelize, DataTypes) => {
  const Volunteers = sequelize.define("Volunteers", {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    verificationType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    verificationDocURI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationPhotoURI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Volunteers.associate = (models) => {
    Volunteers.belongsTo(models.Users, {
      foreignKey: "UserId",
    });
    Volunteers.belongsTo(models.Centers, {
      foreignKey: "CenterId",
    });
    Volunteers.hasMany(models.Donations, {
      foreignKey: "VolunteerId",
    });
  };

  return Volunteers;
};
