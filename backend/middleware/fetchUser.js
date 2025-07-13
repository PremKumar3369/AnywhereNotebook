const jwt = require("jsonwebtoken");
const JWT_ST = "Premkumar";

const fetchUser = (req, res, next) => {
  const token = req.header("authdata");

  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_ST);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Please authenticate again, invalid or expired token" });
  }
};

module.exports = fetchUser;
