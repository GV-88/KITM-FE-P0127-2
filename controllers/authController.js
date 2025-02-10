const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
	return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signup = async (req, res) => {
	try {
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
		});

		const token = signToken(newUser._id);
		res.status(201).json({
			status: "success",
			data: newUser,
			token,
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new Error("Please provide email and password");
		}

		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await user.correctPassword(password, user.password))) {
			throw new Error("Incorrect email or password");
		}

		const token = signToken(user.id);

		res.status(201).json({
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				token,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

//next for middleware
exports.protect = async (req, res, next) => {
	//1. Get token
	let token;
	try {
		if ((req.headers?.authorization ?? "").startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
			console.log(token);
		}
		if (!token) {
			throw new Error("You are not logged in");
		}

		//2. Verify token
		/*
        from jsonwebtoken package doc:
        "If a callback is supplied, function acts asynchronously"
        */
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		console.log(decoded);
		//alternatively:
		// jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { all the logic here })

		//3. Check user in DB
		const currentUser = await User.findById(decoded.id);
		if (!currentUser) {
			throw new Error("User does not exist");
		}

		//4. check user change password after token was issued

		if (currentUser.changedPasswordAfter(decoded.iat)) {
			throw new Error("User changed password");
		}

		// 5. Grant access
		req.user = currentUser;
		next();
	} catch (err) {
		res.status(401).json({
			status: "fail",
			message: err.message,
		});
	}
};
