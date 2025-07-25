const jwt = require("jsonwebtoken");
const User = require("../model/usermodel.js"); // ✅ make sure this is imported

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ success: false, msg: "User not found" });
      }

      req.user = user; // ✅ now a full user object with _id

      next();
    } catch (error) {
      return res.status(401).json({ success: false, msg: "Not authorized" });
    }
  } else {
    return res.status(401).json({ success: false, msg: "No token" });
  }
};

module.exports = { protect };
