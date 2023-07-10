const db = require("../models");
const axios = require("axios");
const moment = require("moment");
const warehouseControllers = {
  insertWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let {
        name,
        address,
        province,
        city,
        district,
        postcode,
        telephone_number,
        latitude,
        longitude,
      } = req.body;
      let response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q:
              !latitude && !longitude
                ? `${address}, ${city}, ${district} ,${province}, ${postcode}`
                : `${latitude}, ${longitude}`,
            countrycode: "id",
            limit: 1,
            key: "aa5cafb42d7849fda849d111ba6aa773",
          },
        }
      );

      let createNewWarehouse = await db.warehouses.create(
        {
          name,
          address: response.data.results[0].formatted,
          province:
            response.data.results[0].components.state ||
            response.data.results[0].components.region,
          city:
            response.data.results[0].components.city ||
            response.data.results[0].components.city_district,
          district:
            response.data.results[0].components.district ||
            response.data.results[0].components.suburb ||
            response.data.results[0].components.subdistrict,
          postcode: response.data.results[0].components.postcode,
          telephone_number,
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        },
        { transaction: t }
      );
      await t.commit();

      return res.status(200).send({
        success: true,
        message: "New warehouse data added",
        dataAPI: response.data.results[0],
      });
    } catch (error) {
      await t.rollback();
      return res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  },
  getWarehouses: async (req, res) => {
    let warehouseData = await db.warehouses.findAndCountAll({
      raw: true,
    });
    console.log(moment(warehouseData.rows[0].id).format("D MMMM YYYY HH.mm"));
    res.status(200).send(warehouseData);
  },
  getCostData: async (req, res) => {
    try {
      const { origin, destination, weight, courier } = req.body;
      const response = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        {
          origin: origin,
          destination: destination,
          weight: weight,
          courier: courier,
        },
        {
          headers: {
            key: "c44434f326fbc4a4e77b699e76323c32",
          },
        }
      );
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
};
module.exports = warehouseControllers;
