


exports.getPage = async (req, res, next) => {
    try {
        return res.render('page/page');
    } catch (err) {
        next(err);
    }
};