const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/Users");
dotenv.config();
const verifytoken = (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    if (!token) {
      res.status(401).json({ msg: "No token , authorized denied" });
    } else {
      const decode = jwt.verify(token, process.env.JWT_SEC);
      req.user = decode;
      next();
    }
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
const verifyAuthorization = (req, res, next) => {
  try {
    verifytoken(req, res, async () => {
      let user = await User.findById(req.user._id);
      if (req.user._id === req.params.id || user.role === "admin") {
        next();
      } else {
        res.status(401).json("You are not allowed to do that");
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error from server !!", error });
  }
};
const verifyTokenAndAdmin = (req, res, next) => {
  try {
    verifyAuthorization(req, res, async () => {
      let user = await User.findById(req.user._id);
      if (user.role === "admin") {
        next();
      } else {
        res.status(401).json("You are not allowed to do that");
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error from server !!", error });
  }
};

const verifyAdminOrVendor = (req, res, next) => {
  try {
    verifytoken(req, res, async () => {
      let user = await User.findById(req.user._id);
      if (user.role === "admin" || user.role === "vendor") {
        next();
      } else {
        res.status(401).json("You are not allowed to do that");
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error from server !!", error });
  }
};

module.exports = {
  verifytoken,
  verifyAuthorization,
  verifyTokenAndAdmin,
  verifyAdminOrVendor,
};
