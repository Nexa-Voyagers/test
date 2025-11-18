/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: {
      documentation: '/api-docs',
      health: '/health',
      auth: '/api/v1/auth',
    },
  });
};
