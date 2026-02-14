function responseFormat(req, res, next) {
  res.success = (data, status = 200, passProp = {}) => {
    res.status(status).json({
      status: "success",
      data,
      ...passProp,
    });
  };
  res.paginate = ({ rows, pagination }) => {
    res.success(rows, 200, { pagination });
  };
  res.error = (status = 500, error = null, message) => {
    console.log(message, status, error);
    res.status(status).json({
      status: "error",
      error,
      message,
    });
  };
  next();
}
module.exports = responseFormat;
