export function notFoundError(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
}

export function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
  });

}

export  function logRequest(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
}