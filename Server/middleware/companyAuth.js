const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verify_company = async (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    if (!token) {
      res.status(401).json({ msg: "No token , authorized denied" });
    } else {
      const decode = jwt.verify(token, process.env.JWT_SEC);
      req.company = decode;
      next();
    }
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = {
  verify_company,
};
