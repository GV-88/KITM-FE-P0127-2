const express = require("express");
const hotelController = require("./../controllers/hotelController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/").get(hotelController.getAllHotels).post(authController.protect, hotelController.createHotel);

router.route("/:id").get(hotelController.getHotel).patch(hotelController.updateHotel).delete(hotelController.deleteHotel);

module.exports = router;
