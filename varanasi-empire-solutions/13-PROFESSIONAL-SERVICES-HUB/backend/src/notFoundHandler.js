/**
 * 404 Not Found handler middleware
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
  });
};

export default notFoundHandler;
