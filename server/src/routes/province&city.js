const express = require("express");
const router = express.Router();
const provinceCityController = require("../controllers").provinceCityController;

router.post("/prov", provinceCityController.addProvinceData);
router.post("/city", provinceCityController.addCityData);

module.exports = router;
