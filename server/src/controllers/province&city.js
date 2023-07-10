const db = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const provinceCityControllers = {
  getProvinceData: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        {
          headers: { key: "c44434f326fbc4a4e77b699e76323c32" },
        }
      );
      await db.provinces.bulkCreate(response.data.rajaongkir.results);
      return res.status(200).send(response.data.rajaongkir.results);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  getCityData: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/city",
        {
          headers: { key: "c44434f326fbc4a4e77b699e76323c32" },
        }
      );
      await db.cities.bulkCreate(response.data.rajaongkir.results);
      return res.status(200).send(response.data.rajaongkir.results);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};

module.exports = provinceCityControllers;
