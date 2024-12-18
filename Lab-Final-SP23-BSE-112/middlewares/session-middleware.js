app.use((req, res, next) => {
    res.locals.user = req.session.user; // Make user session data available in views
    next();
  });
  