import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader.split(" ")[1];
  req.tokenPayload = jwt.verify(authToken, process.env.JWT_KEY);

  next();
};
