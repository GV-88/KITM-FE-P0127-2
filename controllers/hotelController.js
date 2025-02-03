const fs = require("fs");
const Hotel = require("./../models/hotelModel");

const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../data/hotels.json`));

//middlewares (no longer needed when using mongoose)
/*
exports.checkID = (req, res, next, val) => {
	console.log(`Hotel id is: ${val}`);

	if (req.params?.id * 1 > hotels.length) {
		return res.status(404).json({
			status: "failed",
			message: "invalid ID",
		});
	}
	next();
};

exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.address) {
		return res.status(400).json({
			status: "failed",
			message: "please fill all required fields",
		});
	}
	next();
};
*/
//req --> next() --> next() --> res

//get all hotels
exports.getAllHotels = async (req, res) => {
	try {
		const hotels = await Hotel.find();
		res.status(200).json({
			status: "success",
			results: hotels.length,
			data: { hotels },
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

//get hotel
exports.getHotel = async (req, res) => {
	try {
		const hotel = await Hotel.findById(req.params.id);
		res.status(200).json({
			status: "success",
			data: { hotel },
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

//create hotel
exports.createHotel = async (req, res) => {
	try {
		const newHotel = await Hotel.create(req.body);
		res.status(201).json({
			status: "success",
			data: newHotel,
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};

//update hotel
exports.updateHotel = async (req, res) => {
	try {
		const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: { hotel },
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};

//delete hotel
exports.deleteHotel = async (req, res) => {
	try {
		await Hotel.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};
