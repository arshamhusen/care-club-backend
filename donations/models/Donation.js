module.exports = (sequelize, DataTypes) => {
    const Donation = sequelize.define("Donation", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
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
            type: DataTypes.STRING,
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