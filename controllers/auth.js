module.exports.getLogin = (req, res, next) => {
        res.render('auth/login', {
                        pageTitle: 'Authetication',
                        path: '/login',
                    });
};