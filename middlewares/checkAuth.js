const jwt = require("jsonwebtoken");
const config = require("config");

module.exports =  function (req, res, next) {
  
  
  const token = req.header("Authorization")
  
  if (!token) return res.status(403).send("Access Denied No token provied ")
  try {
    
    const decoded = jwt.decode(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    
    
    next();
  } catch (ex) {
    return res.status(400).send("invalid token");
  }
};