module.exports = {
    // no esta logueado
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    }, 
    // Ya esta logueado
    isNotLoggedin (req, res, next) {
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    },
    // si esta Autenticado y es Admin
    isAdmin (req, res, next) {
        console.log(req.user)
        if (req.isAuthenticated()) {
            if (req.user.rol == 'Admin'){
                return next();
            }
            return res.redirect('/profile');
        }
        return res.redirect('/signin');
    },
    // si esta Autentidcado y es Proveedor
    isProveedor (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.rol == 'Proveedor'){
                return next();
            }
            return res.redirect('/profile');
        }
        return res.redirect('/signin');
    }
};