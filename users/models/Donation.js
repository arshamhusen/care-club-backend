module.exports = (sequelize, DataTypes) => {
    const Donation = sequelize.define("Donation", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        isPerishable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING, //STRING or ENUM?
            allowNull: false
        }
    })

    Donation.associate = models => {
        Donation.belongsTo(models.User, {
            foreignKey: "userId",
        })
        Donation.belongsTo(models.Center, {
            foreignKey: "centerId",
        })
    }

    return Donation;
}