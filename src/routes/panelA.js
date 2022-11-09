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


// Donde el administrador llena los datos del proveedor
router.get('/CrearDatos', (req, res) => {
    res.render('admins/CrearDatos');
});

router.post('/CrearDatos', async (req, res) => {
    const id = req.user.id;
    console.log(req.body)
    const { fono, razon_social, rut, giro, direccion, ubicacion , anos_servicio, proyectos_ejecutados, description} = req.body;
    const DatosP = {
        fono,
        razon_social,
        rut,
        giro,
        direccion,
        ubicacion,
        anos_servicio,
        proyectos_ejecutados,
        description,
        user_id: user_id
    };
    //console.log(DatosP)
    await pool.query('INSERT INTO proveedor set ?', [DatosP]);
    req.flash('Correcto!', 'Datos Creados Correctamente');
    res.redirect('/panelA/servicios');
});


module.exports = router;