const express = require("express");
const router = express.Router();
const provinceCityController = require("../controllers").provinceCityController;

router.post("/prov", provinceCityController.getProvinceData);
router.post("/city", provinceCityController.getCityData);

module.exports = router;
