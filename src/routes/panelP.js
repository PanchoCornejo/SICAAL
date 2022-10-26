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
router.get('/perfilP',isProveedor, async (req, res) => {

    console.log("Te dare los datos: " + req.user.id)
    const id = req.user.id;
    console.log("la id es: " +id)
    const datos = await pool.query('SELECT * FROM proveedor WHERE user_id = ?', [id]);
    console.log("Datos de la Consulta SQL");
    console.log(datos);
    res.render('proveedores/perfilP', {datos: datos[0]});
});

//router.get('/perfilP',isProveedor ,(req, res) => {
//    res.render('proveedores/perfilP');
//});


// Donde puede el Proveedor: editar su perfil.

router.get('/editar',isProveedor,  async (req, res) => {
    const id = req.user.id;
    console.log(id)
    const provee = await pool.query('SELECT * FROM proveedor WHERE id = ?', [id]);
    console.log(provee[0]);
    res.render('proveedores/editarP', {provee: provee[0]});
});

router.post('/editar', isProveedor ,  async (req, res) => {
    const id = req.user.id;
    const { title, description, url} = req.body; 
    const newProvee = {
        title,
        description,
        url
    };
    await pool.query('UPDATE proveedor set ? WHERE id = ?', [newProvee, id]);
    req.flash('Logrado', 'Datos de proveedor Actualizados correctamente');
    res.redirect('/panelP/perfilP');
});

//Donde el proveedor puede rellenar sus datos

// Donde el administrador llena los datos del proveedor
router.get('/CrearDatos', (req, res) => {
    res.render('proveedores/CrearDatos');
});

router.post('/CrearDatos', async (req, res) => {
    const id = req.user.id;
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
        user_id: id
    };
    await pool.query('INSERT INTO proveedor set ?', [DatosP]);
    req.flash('Correcto!', 'Datos Creados Correctamente');
    res.redirect('/panelP/perfilP');
});

module.exports = router;