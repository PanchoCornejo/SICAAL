const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isAdmin } = require('../lib/auth');


// Donde puede el Administrador: puede revisar las solicitudes de publicacion , las cuales aceptara o rechazara.
router.get('/solicitudes',isAdmin , async(req, res) => {

    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'pendiente'");

    res.render('admins/solicitudes', { datos : datos });
});


router.post('/aprobar', async(req,res) => {
    console.log("aca?????aa")
    //const obj = Object.assign({},req.body)
    //const obj = JSON.parse(JSON.stringify(req.body))
    const {id} = req.body;

    const update = await pool.query(`update servicios set estado_publicacion = 'aprobado' where id = ${id};  `);

    console.log(id)
    res.send({res:"aprobado", id : id})
})

router.post('/rechazar', async(req,res) => {
    console.log("Rechazar")
    //const obj = Object.assign({},req.body)
    //const obj = JSON.parse(JSON.stringify(req.body))
    const {id} = req.body;

    const update = await pool.query(`update servicios set estado_publicacion = 'rechazado' where id = ${id};  `);

    //console.log(id)
    res.send({res:"rechazado", id : id})
})


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
router.get('/servicios', isAdmin,async (req, res) => {

    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");

    res.render('admins/servicios', { datos : datos });
    
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

// Donde los Administradores pueden asignar los servicios a sus clientes.


router.get('/Orden', isAdmin, async (req, res) => {

    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
    const idd = req.user.id;
    res.render('admins/Orden', {datos : datos} );
});


router.get('/gestionarorden', async(req,res)=>{
    const datos = await pool.query("select * from orden")
    
    console.log("--- Gestionar orden", datos)

    res.render('admins/gestionar', {datos});
})



// Asignador 

router.get('/Asignar/:idS', isAdmin, async (req, res) => {
    const { idS } = req.params;
    console.log(req.params);
    console.log("Estas pasando por aqui:   "+ idS);
    const copia = idS;
    console.log("copia es : " + copia);
    const otronombre = await pool.query('SELECT * FROM servicios WHERE id = ?', [idS]);
    const Personas = await pool.query('SELECT username FROM users WHERE users.rol = "cliente"');
    console.log(Personas);
    console.log(otronombre[0].id);
    const valores = {
        id : otronombre[0].id,
        nombre : otronombre[0].nombre,
        estado : otronombre[0].estado
    }
    res.render('admins/Asignar', {Personas, valores });
});

router.post('/Asignar', isAdmin, async (req, res) => {
    const { ServiD , nombre, estado, cliente, description} = req.body;
    console.log(req.body);
    console.log("El ID del Servicio:  "+ServiD);
    console.log("el nombre de usuario:  "+nombre);
    console.log("el estado:  "+estado);
    console.log("el nombre del cliente:  "+cliente);
    console.log("La descripcion:  "+description);
    const user_id = await pool.query('SELECT id FROM users WHERE username = ?', [cliente])
    const Opcion = {
        user_id,
        ServiD,
        description
    };
    console.log(Opcion.ServiD);
    await pool.query('INSERT INTO orden set user_id = ? , servicio_id = ?, description = ?', [Opcion.user_id[0].id,Opcion.ServiD,Opcion.description]);
    req.flash('success', 'Orden Generada Correctamente');
    res.redirect('/panelA/perfilA');
});

module.exports = router;