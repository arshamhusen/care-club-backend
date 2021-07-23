const { v1: uuidv1 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const DonationsMedia = sequelize.define("DonationsMedia", {
    photoURI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return DonationsMedia;
};
