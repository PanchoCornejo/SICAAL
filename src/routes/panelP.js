const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isProveedor } = require('../lib/auth');


// Donde puede el Proveedor: publicar una solicitud de su servicio.
router.get('/publicar',isProveedor ,(req, res) => {
    res.render('proveedores/publicar');
});

// Donde puede el Proveedor: revisa sus publicaciones (activas) y eliminarlas.
router.get('/misservicios',isProveedor ,(req, res) => {
    res.render('proveedores/misservicios');
});

// Donde puede el Proveedor: mirar su perfil.
router.get('/perfilP',isProveedor ,(req, res) => {
    res.render('proveedores/perfilP');
});


// Donde puede el Proveedor: editar su perfil.
router.get('/editar',isProveedor ,(req, res) => {
    res.render('proveedores/editar');
});


module.exports = router;