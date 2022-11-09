const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isProveedor } = require('../lib/auth');

const uploadFile = require('../lib/multer')


// Donde puede el Proveedor: publicar una solicitud de su servicio.
router.get('/publicar',isProveedor ,(req, res) => {
    res.render('proveedores/publicar');
});

// Donde puede el Proveedor: revisa sus publicaciones (activas) y eliminarlas.
router.get('/misservicios',isProveedor ,async(req, res) => {
    console.log("---- aca miservicios")
    const id = req.user.id;
    const datos = await pool.query('SELECT * FROM servicios WHERE user_id = ?', [id]);
    //console.log(datos[0])

    //Ojo con esto... Leer el txt que dejé
    console.log(datos[0])
    res.render('proveedores/misservicios',{datos : datos});
});

// Donde puede el Proveedor: mirar su perfil.
router.get('/perfilP',isProveedor, async (req, res) => {

    console.log("-------------------")
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
    
    console.log("Queda aca???")
    console.log(req.body)
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


router.post('/publicar', uploadFile(), async function(req, res, next){
    // console.log(req.user.proveedor_id);
    console.log("----aca-----")

    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [req.user.id]);
    const user_id = req.user.id;
    const proveedor_id = result[0].id;
    
    const { nombre, marca,ano, modelo,horometro, operador, region, ciudades, estado, categoria, description} = req.body;
    
    
    let DatosP = {
        user_id,
        proveedor_id,
        nombre,
        marca,
        ano,
        modelo,
        horometro,
        operador,
        region,
        ciudades,
        estado,
        categoria,
        description
    };
    console.log("datos ",DatosP)

    await pool.query('INSERT INTO servicios set ?', [DatosP]);
    res.redirect('/panelP/misservicios');
    

});

module.exports = router;
