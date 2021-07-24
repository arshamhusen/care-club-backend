module.exports = (sequelize, DataTypes) => {
  const Centers = sequelize.define("Centers", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    phone: {
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
    profileImgURI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationDocURI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDocsVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Centers.associate = (models) => {
    Centers.hasMany(models.Donations, {
      onDelete: "cascade",
      foreignKey: "CenterId",
    });
  };

  return Centers;
};
