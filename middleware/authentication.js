const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const nodeEnvConfig = require("../nodeEnvConfig");
nodeEnvConfig.envConfig();

const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  if (!token) {
    return res.status(403).send({
      statusCode: 403,
      error: true,
      message: "Token Required.",
    });
  }

  try {
    req.token = token;
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    if (Date.now() >= decoded.exp * 8000) {
      return false;
    }
  } catch (err) {
    return res.status(401).send({
      statusCode: 401,
      error: true,
      message: "Invalid Token.",
    });
  }
  return next();
};

const decodeUser = function (req) {
  const token =
    req != undefined ? jwtDecode(req.headers["x-access-token"]) : {};
  return token;
};

const ticketMailConfig = function () {
  return {
    //  host: "smtp.office365.com",
    //   port: 587,
    //   secure: false,
    service: process.env.MAIL_CONFIG_SERVICE,
    auth: {
      user: process.env.MAIL_CONFIG_USER,
      pass: process.env.MAIL_CONFIG_PASSWORD,
    },
  };
};

module.exports = {
  verifyToken,
  decodeUser,
  ticketMailConfig,
};
