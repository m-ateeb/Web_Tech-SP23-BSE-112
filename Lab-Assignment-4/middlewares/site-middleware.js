let User = require("../models/user.model");

module.exports = async function (req, res, next) {
  if (req.session.user) {
    // If the user is logged in, fetch the user from the session and attach it to req.user
    try {
      let loggedInUser = await User.findById(req.session.user._id);
      req.user = loggedInUser;
      res.locals.user = loggedInUser;
    } catch (err) {
      // Handle error if the user is not found (perhaps session is corrupted)
      console.error("User not found", err);
      req.user = null;
      res.locals.user = null;
    }
  } else {
    // If no session user exists, handle the case appropriately (default or null)
    req.user = null;
    res.locals.user = null;
  }
  
  next();
};
