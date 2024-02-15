module.exports = function (req, res, next) {
    // 401 Unauthorized
    // 403 Forbidden
    if (!process.env.AUTH) return next();

    if (!req.user.isAdmin)
        return res.status(403).send("Access denied (Admin Only)");

    next();
};
