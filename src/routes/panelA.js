const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isAdmin } = require('../lib/auth');


// Donde puede el Administrador: puede revisar las solicitudes de publicacion , las cuales aceptara o rechazara.
router.get('/solicitudes',isAdmin ,(req, res) => {
    res.render('admins/solicitudes');
});

// Donde puede el Administrador: recuperar contrseñas para los proveedores 
router.get('/restaurarcontraseña', isAdmin,(req, res) => {
    res.render('admins/restaurarcontraseña');
});

 // Donde puede el Administrador: Borrar Publicaciones y editarlas. 
router.get('/servicios', isAdmin,(req, res) => {
    res.render('admins/servicios');
});

 // Donde puede el Administrador: Donde puede visitar la lista de proveedores y ver sus datos. 
 router.get('/proveedores', isAdmin,(req, res) => {
    res.render('admins/proveedores');
});

 // Donde puede el Administrador: puede revisar su perfil. 
 router.get('/perfilA', isAdmin,(req, res) => {
    res.render('admins/perfilA');
});


module.exports = router;