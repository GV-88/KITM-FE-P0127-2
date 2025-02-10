class APIFeatures {
	/**
	 * An instance that uses chainable inputless methods to mutate its own query property
	 * @param {*} query promise of Mongoose query, like: Hotel.find()
	 * @param {string} queryString from GET request URL
	 */
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		/*
		Query should look like this: url?page=1&sort=room_price,comfort&fields=name,address&room_price[lt]=300
		First convert the query string into a key-value form; brackets will convert into nested objects
		Then take away known keywords, leaving only field names for filtering, like: `room_price: { lt: "300" }`
		Then convert it back to JSON and add $ symbol for Mongoose query syntax
		The chainable methods of the APIFeatures object work by mutating the query property of the instance
		GENIUS?
		*/
		const queryObj = { ...this.queryString };

		const excludedFields = ["page", "sort", "limit", "fields"];

		excludedFields.forEach((el) => {
			delete queryObj[el];
		});

		let queryStr = JSON.stringify(queryObj);

		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy + " _id");
		} else {
			this.query = this.query.sort("-createdAt _id");
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v"); //TODO: figure this out
		}
		return this;
	}

	paginate() {
		const page = parseInt(this.queryString.page) || 1;
		const limit = parseInt(this.queryString.limit) || 100;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeatures;
