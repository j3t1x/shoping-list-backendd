function authorize(role) {
    return (req, res, next) => {
      const userRole = req.headers["role"];
      if (!userRole || userRole !== role) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    };
  }
  
  module.exports = authorize;
  