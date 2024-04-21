// authMiddleware.js

exports.protect = (req, res, next) => {
  if (!req.cookies.userId) {
    res.status(401).send({ message: "Not authorized" });
  } else {
    req.user = { id: req.cookies.userId };
    next();
  }
};
