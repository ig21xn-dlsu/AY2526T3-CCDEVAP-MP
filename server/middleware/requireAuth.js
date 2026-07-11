const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT sent in the Authorization header and attaches
// the corresponding user to req.user so routes can trust req.user._id
// instead of anything the client claims in req.body.
//
// Expects header format:  Authorization: Bearer <token>
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1]; // strips the "Bearer " prefix

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // attach just the id (or fetch more fields with .select() if a route needs them)
    req.user = await User.findById(_id).select("_id");

    if (!req.user) {
      return res.status(401).json({ message: "Request is not authorized" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Request is not authorized" });
  }
};

module.exports = requireAuth
