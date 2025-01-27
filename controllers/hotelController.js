const fs = require("fs");

const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../data/hotels.json`));

//middlewares

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

//req --> next() --> next() --> res

//get all hotels
exports.getAllHotels = (req, res) => {
	res.status(200).json({
		status: "success",
		requestedAt: req.requestTime,
		results: hotels.length,
		data: {
			hotels,
		},
	});
};

//get hotel
exports.getHotel = (req, res) => {
	// console.log("getHotel");
	const id = req.params.id * 1;
	const hotel = hotels.find((hotel) => hotel.id === id);
	res.status(200).json({
		status: "success",
		data: { hotel },
	});
};

//create hotel
exports.createHotel = (req, res) => {
	const newId = hotels[hotels.length - 1].id + 1;
	const newHotel = Object.assign({ id: newId }, req.body);

	hotels.push(newHotel);

	// not the best solution for file path here
	fs.writeFile(`${__dirname}/../data/hotels.json`, JSON.stringify(hotels), (err) => {
		console.error(err);
		res.status(201).json({
			status: "success",
			data: { newHotel },
		});
	});
};

//update hotel
exports.updateHotel = (req, res) => {
	res.status(200).json({
		status: "success",
	});
};

//delete hotel
exports.deleteHotel = (req, res) => {
	res.status(204).json({
		status: "success",
	});
};
