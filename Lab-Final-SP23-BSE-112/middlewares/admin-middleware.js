module.exports = async function (req, res, next) {
    // Check if the user is logged in and has an "admin" role
    //if (!req.session.user || !req.session.user.role || !req.session.user.role.includes("admin")) {
        if (!req.session.user ) {
      return res.redirect("/login");
    }
    next(); // Proceed if the user is admin
  };
  