const express = require("express");
const morgan = require("morgan");

//routes
const hotelRouter = require("./routes/hotelRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/hotels", hotelRouter);

module.exports = app;
