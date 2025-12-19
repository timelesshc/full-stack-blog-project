const errorHandler = (err, req, res, next) => {
    res.status(500).render("error.ejs", {
        title: "Error",
        user: req.user,
        error: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;