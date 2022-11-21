const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isProveedor } = require('../lib/auth');

const uploadFile = require('../lib/multer')


// Donde puede el Proveedor: publicar una solicitud de su servicio.
router.get('/publicar',isProveedor , async(req, res) => {

    const regiones = await pool.query('SELECT name FROM regions;');
    const ciudades = await pool.query('SELECT name FROM cities;');
    res.render('proveedores/publicar', {regiones, ciudades});
});

// Donde puede el Proveedor: revisa sus publicaciones (activas) y eliminarlas.
router.get('/misservicios', isProveedor, async (req, res) => {
    const id = req.user.id;
    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [id]);
    const proveedor_id = result[0].id;
    // console.log(id);
    const datos = await pool.query('SELECT * FROM servicios WHERE servicios.proveedor_id = ?', [proveedor_id]);
    // console.log(servicios);
    res.render('proveedores/misservicios', {datos});
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
    const provee = await pool.query('SELECT * FROM proveedor WHERE user_id = ?', [id]);
    console.log(provee[0]);
    res.render('proveedores/editarP', {provee: provee[0]});
});

router.post('/editar', isProveedor ,  async (req, res) => {
    const id = req.user.id;
    const { fono, razon_social, rut, giro, direccion, ubicacion , anos_servicio, proyectos_ejecutados, description} = req.body;
    const newProvee = {
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
    console.log("descripciondelo que hago:");
    console.log(newProvee.rut);
    await pool.query('UPDATE proveedor set rut = ? , fono = ?, razon_social = ?, giro = ?, direccion = ?, ubicacion = ?, anos_servicio = ?, proyectos_ejecutados = ?, description = ? WHERE user_id = ?', [newProvee.rut,newProvee.fono,newProvee.razon_social,newProvee.giro,newProvee.direccion,newProvee.ubicacion,newProvee.anos_servicio,newProvee.proyectos_ejecutados,newProvee.description, id]);
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
    const { nombre, marca, ano, modelo, horometro, operador, region, ciudades, estado, categoria, description} = req.body;

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
    console.log(DatosP);

    if (req.files.domMaq) {

        DatosP.dominio_de_la_maquina = req.files.domMaq[0].path;

        
    } else {
        DatosP.dominio_de_la_maquina = 'null';  
    }
    if (req.files.revTec) {
        
        DatosP.revision_tecnica = req.files.revTec[0].path;

    } else {
        DatosP.revision_tecnica = 'null';   
    }

    if (req.files.perCir) {
        
        DatosP.permiso_de_circulacion = req.files.perCir[0].path;

    } else {
        DatosP.permiso_de_circulacion = 'null';
    }

    if (req.files.seg) {
        
        DatosP.seguro = req.files.seg[0].path;

        
    } else {
        DatosP.seguro = 'null';
    }

    if (req.files.docOpe) {
        
        DatosP.documentacion_operador = req.files.docOpe[0].path;

        
    } else {
        DatosP.documentacion_operador = 'null';
    }

    const uploadQuery = await pool.query('INSERT INTO servicios set ?', [DatosP]);

    req.flash('¡Correcto!', 'Servicio creado correctamente.');
    res.redirect('/panelP/perfilP');
    
    
//     let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [req.user.id]);
//     const user_id = req.user.id;
//     const proveedor_id = result[0].id;
    
//     const { nombre, marca,ano, modelo,horometro, operador, region, ciudades, estado, categoria, description} = req.body;
    
    
//     let DatosP = {
//         user_id,
//         proveedor_id,
//         nombre,
//         marca,
//         ano,
//         modelo,
//         horometro,
//         operador,
//         region,
//         ciudades,
//         estado,
//         categoria,
//         description
//     };
//     console.log("datos ",DatosP)

//     await pool.query('INSERT INTO servicios set ?', [DatosP]);
//     res.redirect('/panelP/misservicios');
    

});

module.exports = router;
