const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  //req	The incoming HTTP request object (has headers, body, params), res	The response object (used to send a response), next	A callback function — if you call next(), Express moves to the next middleware or route

  const authHeader = req.headers.authorization; //  req.headers: This is an object with all request headers, authorization header is where JWT tokens are sent -> Authorization: Bearer <token>

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(400).json({ message: "No token, authorization denied." });
  }

  const token = authHeader.split(" ")[1]; //header looks like -> Authorization: Bearer abc.def.ghi
  //You split on space " " → ['Bearer', 'abc.def.ghi'] Take [1] → the actual token: "abc.def.ghi"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // checks if the token is:Correctly signed Not expired Not tampered with
    req.user = decoded.userId; //decoded will now contain the payload of the token, for example: { userId: '68585e...', iat: 12345678, exp: 12345778 }
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Token not valid." });
  }
}

module.exports = authMiddleware;
