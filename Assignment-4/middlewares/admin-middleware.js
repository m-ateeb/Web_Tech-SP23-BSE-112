  module.exports = async function (req, res, next) {
    console.log('Admin middleware loaded'); // Add this line
    if (!req.session.user?.role.includes("admin")) return res.redirect("/login");
    else next();
};