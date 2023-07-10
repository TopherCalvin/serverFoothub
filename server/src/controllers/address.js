const db = require("../models");
const axios = require("axios");
const addressControllers = {
  insertAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let {
        title,
        road,
        district,
        city,
        province,
        postcode,
        latitude,
        longitude,
        recipient,
        phone_number,
      } = req.body;
      let response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q:
              !latitude && !longitude
                ? `${road}, ${city}, ${district} ,${province}, ${postcode}`
                : `${latitude}, ${longitude}`,
            countrycode: "id",
            limit: 1,
            key: "aa5cafb42d7849fda849d111ba6aa773",
          },
        }
      );
      let createNewAddress = await db.addresses.create(
        {
          title,
          address: response.data.results[0].formatted,
          road: response.data.results[0].components.road,
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
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
          recipient,
          phone_number,
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({
        success: true,
        message: "New address data added",
        dataAPI: response.data.results[0],
      });
    } catch (error) {
      await t.rollback();
      return res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  },
  updateAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let {
        title,
        road,
        district,
        city,
        province,
        postcode,
        latitude,
        longitude,
        recipient,
        phone_number,
      } = req.body;
      let response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q:
              !latitude && !longitude
                ? `${road}, ${city}, ${district} ,${province}, ${postcode}`
                : `${latitude}, ${longitude}`,
            countrycode: "id",
            limit: 1,
            key: "aa5cafb42d7849fda849d111ba6aa773",
          },
        }
      );
      const checkAddress = await db.addresses.findOne({
        where: { id: req.params.id },
      });
      if (checkAddress) {
        if (checkAddress.user_id == req.params.id) {
          let editAddress = await db.addresses.update(
            {
              title,
              address: response.data.results[0].formatted,
              road: response.data.results[0].components.road,
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
              latitude: response.data.results[0].geometry.lat,
              longitude: response.data.results[0].geometry.lng,
              recipient,
              phone_number,
            },
            { where: { id: req.params.id }, transaction: t }
          );
          await t.commit();
          return res.status(200).send({
            success: true,
            message: `address ${checkAddress.title} has been updated`,
            dataAPI: response.data.results[0],
          });
        } else {
          return res
            .status(400)
            .send({ message: "you do not have access to this address" });
        }
      } else {
        return res.status(400).send({ message: "address not found" });
      }
    } catch (error) {
      await t.rollback();
      return res.status(500).send({ message: error.message });
    }
  },
  deleteAdrress: async (req, res) => {
    try {
      let checkAddress = await db.addresses.findOne({
        where: { id: req.query.id },
      });
      if (checkAddress) {
        if (checkAddress.user_id == req.params.user_id) {
          let deleteAddress = await db.addresses.destroy({
            where: { user_id: req.params.user_id, id: req.query.id },
          });
        } else {
          res.status(400).send({
            message: "can't delete other user's address.",
          });
        }
      } else {
        res.status(400).send({
          message: "Address not found.",
        });
      }
      res.status(200).send({
        success: true,
        message: `Address ${checkAddress} has been deleted!`,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
module.exports = addressControllers;
