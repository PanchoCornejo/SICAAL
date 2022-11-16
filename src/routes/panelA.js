const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isAdmin } = require('../lib/auth');


// Donde puede el Administrador: puede revisar las solicitudes de publicacion , las cuales aceptara o rechazara.
router.get('/solicitudes',isAdmin ,(req, res) => {
    res.render('admins/solicitudes');
});

// Donde puede el Administrador: recuperar contrseñas para los proveedores 
//router.get('/restaurar', isAdmin, async(req, res) => {
//    const cuentas = await pool.query('SELECT username FROM users');
//    console.log(cuentas[1].username);
//    res.render('admins/restaurar', { cuentas : cuentas });
//});

//router.post('/restaurar', isAdmin ,  async (req, res) => {
//    const id = req.user.id;
//    const { fullname, constraseña } = req.body;
//    const newPass = {
//        fullname,
//        constraseña,
//        user_id: id
//    };
//    newPass.constraseña = await helpers.encryptPassword(constraseña);
//    console.log("nueva contraseña: "+ newPass.constraseña);
    //await pool.query('UPDATE users set fullname = ? WHERE id = ?', [newName.fullname, id]);
//    req.flash('Logrado', 'Nombre Actualizado correctamente');
//    res.redirect('/panelA/perfilA');
//});

 // Donde puede el Administrador: Borrar Publicaciones y editarlas. 
router.get('/servicios', isAdmin,(req, res) => {
    res.render('admins/servicios');
});

 // Donde puede el Administrador: Donde puede visitar la lista de proveedores y ver sus datos. 
 router.get('/proveedores', isAdmin,async(req, res) => {
    console.log("tamos aca")
    const datos = await pool.query('SELECT * FROM proveedor');
    console.log(datos)
    res.render('admins/proveedores',{ datos : datos });
});

 // Donde puede el Administrador: puede revisar su perfil. 
 router.get('/perfilA', isAdmin, async (req, res) => {
    const idd = req.user.id;
    const nombree = await pool.query('SELECT fullname FROM users WHERE id = ?', [idd]);
    res.render('admins/perfilA', {nombree: nombree[0]} );
});

 // Donde puede el Administrador: puede editar su perfil. 
 router.get('/editar', isAdmin, async (req, res) => {
    const idd = req.user.id;
    const nombree = await pool.query('SELECT fullname FROM users WHERE id = ?', [idd]);
    res.render('admins/editar', {nombree: nombree[0]} );
});


router.post('/editarA', isAdmin ,  async (req, res) => {
    const id = req.user.id;
    const { fullname } = req.body;
    const newName = {
        fullname,
        user_id: id
    };
    console.log(newName.fullname);
    await pool.query('UPDATE users set fullname = ? WHERE id = ?', [newName.fullname, id]);
    req.flash('Logrado', 'Nombre Actualizado correctamente');
    res.redirect('/panelA/perfilA');
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