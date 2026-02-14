const notFoundHandler = (req, res) => {
  res.error(404, null, "Resource not found");
};
module.exports = notFoundHandler;
