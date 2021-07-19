module.exports = (sequelize, DataTypes) => {
    const Intakes = sequelize.define("Centers", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      intakeCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      intakeYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Intakes;
  };
  