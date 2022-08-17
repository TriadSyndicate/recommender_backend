const express = require("express");
const {
  getLocationByName,
  respondLocation,
  requestValidator,
  getAttractionsAndStore,
  attractionById,
  getCategoriesFromAttractionArray,
  getAttractionsFromArray,
} = require("../controllers/getLocation");
const router = express.Router();
const { check } = require("express-validator");
router.post(
  "/location",
  [
    check("locationName").exists(),
    check("locationName", "Location Query is required").notEmpty(),
  ],
  requestValidator,
  getLocationByName,
  respondLocation
);

router.post(
  "/location/details",
  [
    check("geoId").exists(),
    check("geoId").matches(/\d/).withMessage("Incorrect GeoId"),
    check("name").exists(),
    check("name", "Location Name Required").notEmpty(),
  ],
  requestValidator,
  getAttractionsAndStore
);

router.get("/attraction/:attractionId", (req, res) => {
  res.json({
    attraction: req.attraction,
    category: req.category,
  });
});
router.param("attractionId", attractionById);

router.post(
  "/location/categories",
  [check("attractions").exists()],
  requestValidator,
  getCategoriesFromAttractionArray
);

router.post(
  "/location/attractions",
  [check("attractions").exists()],
  requestValidator,
  getAttractionsFromArray
);

module.exports = router;
