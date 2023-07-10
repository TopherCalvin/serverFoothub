module.exports = (sequelize, Sequelize) => {
  const warehouses = sequelize.define(
    "warehouses",
    {
      name: Sequelize.STRING,
      address: Sequelize.STRING,
      province: Sequelize.STRING,
      city: Sequelize.STRING,
      district: Sequelize.STRING,
      postcode: Sequelize.INTEGER,
      telephone_number: Sequelize.STRING,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
    },
    {
      paranoid: true,
    }
  );
  return warehouses;
};