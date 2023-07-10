module.exports = (sequelize, Sequelize) => {
  const addresses = sequelize.define(
    "addresses",
    {
      title: Sequelize.STRING,
      address: Sequelize.STRING,
      province: Sequelize.STRING,
      city: Sequelize.STRING,
      district: Sequelize.STRING,
      postcode: Sequelize.INTEGER,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
      recipient: Sequelize.STRING,
      phone_number: Sequelize.STRING,
      is_primary: Sequelize.BOOLEAN,
      user_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return addresses;
};
