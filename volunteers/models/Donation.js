module.exports = (sequelize, DataTypes) => {
  const Donations = sequelize.define("Donations", {
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
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Donations.associate = (models) => {
    Donations.belongsTo(models.Users, {
      foreignKey: "UserId",
    });
    Donations.belongsTo(models.Centers, {
      foreignKey: "CenterId",
    });
    Donations.hasMany(models.DonationsMedia, {
      foreignKey: "DonationId",
    });
  };

  return Donations;
};
