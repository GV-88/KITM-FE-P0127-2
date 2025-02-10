const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Hotel must have a name"],
			unique: true,
		},
		address: {
			type: String,
			required: [true, "Hotel must have address"],
		},
		rankingAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Ranking can not be lower than 1"],
			max: [5, "Ranking can not be higher than 5"],
		},
		room_price: {
			type: Number,
			required: [true, "Must have room price"],
		},
		price_discount: {
			type: Number,
		},
		comfort: {
			type: String,
			required: [true, "Hotel must have comfort rating"],
			enum: { values: ["1", "2", "3", "4", "5", "6", "7"] },
		},
		summary: {
			type: String,
			trim: true,
			required: [true, "Hotel must have summary"],
		},
		image_cover: {
			type: String,
			required: [true, "A hotel must have an image"],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

hotelSchema.virtual("reviews", { ref: "Review", foreignField: "hotel", localField: "_id" });

//singular naming
const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
