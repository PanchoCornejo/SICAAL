const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isAdmin } = require('../lib/auth');


// Donde puede el Administrador: puede revisar las solicitudes de publicacion , las cuales aceptara o rechazara.
router.get('/solicitudes',isAdmin , async(req, res) => {

    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'pendiente'");

    res.render('admins/solicitudes', { datos : datos });
});

// Donde El Administrador puede ver los nuevos Proveedores pidiendo contactarse
router.get('/nuevosproveedores',isAdmin , async(req, res) => {

    const prov = await pool.query("SELECT * FROM Sproveedor");

    res.render('admins/nuevosproveedores', { prov : prov });
});

router.post('/nuevosproveedores', isAdmin ,async(req,res) => {
    const { VALid } = req.body;
    const Val = { VALid };
    await pool.query('DELETE FROM Sproveedor WHERE id = ?', [Val.VALid]);
    console.log("Eliminado")
    res.redirect('/panelA/perfilA');
})

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



 // Donde puede el Administrador: Borrar Publicaciones y editarlas. 
router.get('/servicios', isAdmin,async (req, res) => {

    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
    const valor = await pool.query('SELECT servicio_id, AVG(valoracion) as General,AVG(Voperador) as Operador,AVG(Vpuntualidad) as Puntualidad,AVG(Vexperiencia) as Experiencia, AVG(Vfallas) as Fallas, AVG(Vestadomaquina) as Estadomaquina FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios where estado_publicacion = "aprobado") GROUP BY servicio_id;');
    console.log(datos);
    res.render('admins/servicios', { datos : datos });
    
});

// Donde puede el Administrador: ver el servicio a detalle con sus valoraciones 
router.post('/ServicioaDetalle', isAdmin,async (req, res) => {
    const { id } = req.body;
    console.log(id);
    const IDD = {
        id
    };
    const datos = await pool.query(`select servicios.* from servicios where servicios.id = ${id}`);
    console.log(datos);
    const valor = await pool.query('SELECT servicio_id, Round(Avg(valoracion), 1) AS general, Round(Avg(Voperador), 1) AS operador, Round(Avg(Vpuntualidad), 1) AS puntualidad, Round(Avg(Vexperiencia), 1) AS experiencia, Round(Avg(Vfallas), 1) AS fallas, Round(Avg(Vestadomaquina), 1) AS estadomaquina FROM valoraciones WHERE servicio_id IN(SELECT id FROM servicios WHERE estado_publicacion = "aprobado") AND servicio_id = ? GROUP BY servicio_id', [IDD.id]);
    console.log("Valoraciones");
    console.log(valor);
    res.render('admins/ServicioaDetalle', { datos : datos, valor : valor });  
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
    const datos = await pool.query("select DISTINCT users.fullname,orden.servicio_id,orden.description,proveedor.razon_social from users,orden,servicios,proveedor where orden.user_id = users.id and orden.servicio_id = servicios.id and servicios.proveedor_id = proveedor.id;")
    
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

router.post('/baja', async(req,res)=> {
    const {id} = req.body;
    await pool.query(`DELETE FROM servicios WHERE id = ${id}`);
    
    res.send({ok : 'baja', id : id})
})



router.get('/Dashboard', isAdmin, async (req, res) => {
    //necesitamos las ciudades x region
    const arica = await pool.query('SELECT id_city, name FROM cities WHERE id_region="1"');
    const tarapaca = await pool.query('SELECT id_city, name FROM cities WHERE id_region="2"');
    const antofagasta = await pool.query('SELECT id_city, name FROM cities WHERE id_region="3"');
    const atacama = await pool.query('SELECT id_city, name FROM cities WHERE id_region="4"');
    const coquimbo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="5"');
    const valparaiso = await pool.query('SELECT id_city, name FROM cities WHERE id_region="6"');
    const metropolitana = await pool.query('SELECT id_city, name FROM cities WHERE id_region="7"');
    const bernardo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="8"');
    const maule = await pool.query('SELECT id_city, name FROM cities WHERE id_region="9"');
    const ñuble = await pool.query('SELECT id_city, name FROM cities WHERE id_region="10"');
    const biobio = await pool.query('SELECT id_city, name FROM cities WHERE id_region="11"');
    const araucania = await pool.query('SELECT id_city, name FROM cities WHERE id_region="12"');
    const rios = await pool.query('SELECT id_city, name FROM cities WHERE id_region="13"');
    const lagos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="14"');
    const carlos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="15"');
    const antartica = await pool.query('SELECT id_city, name FROM cities WHERE id_region="16"');
    //Ciudad y Numero de servicios en aquilla ciudad
    const Narica = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 1 GROUP  BY cities.NAME, cities.id_city');
    const Ntarapaca = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 2 GROUP  BY cities.NAME, cities.id_city');
    const Nantofagasta = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 3 GROUP  BY cities.NAME, cities.id_city');
    const Natacama = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 4 GROUP  BY cities.NAME, cities.id_city');
    const Ncoquimbo = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 5 GROUP  BY cities.NAME, cities.id_city');
    const Nvalparaiso = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 6 GROUP  BY cities.NAME, cities.id_city');
    const Nmetropolitana = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 7 GROUP  BY cities.NAME, cities.id_city');
    const Nbernardo = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 8 GROUP  BY cities.NAME, cities.id_city');
    const Nmaule = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 9 GROUP  BY cities.NAME, cities.id_city');
    const Nñuble = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 10 GROUP  BY cities.NAME, cities.id_city');
    const Nbiobio = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 11 GROUP  BY cities.NAME, cities.id_city');
    const Naraucania = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 12 GROUP  BY cities.NAME, cities.id_city');
    const Nrios = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 13 GROUP  BY cities.NAME, cities.id_city');
    const Nlagos = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 14 GROUP  BY cities.NAME, cities.id_city');
    const Ncarlos = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 15 GROUP  BY cities.NAME, cities.id_city');
    const Nantartica = await pool.query('SELECT cities.NAME, cities.id_city, Count(*) AS nro_servicios FROM   CServicio, cities, servicios WHERE  CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = 16 GROUP  BY cities.NAME, cities.id_city');

    //necesitamos los proveedores x region con su Cantidad de Servicios alli y Valoracion (CONSULTA 1)
    const Parica = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 1 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Ptarapaca = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 2 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pantofagasta = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 3 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Patacama = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 4 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pcoquimbo = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 5 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pvalparaiso = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 6 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pmetropolitana = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 7 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pbernardo = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 8 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pmaule = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 9 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pñuble = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 10 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pbiobio = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 11 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Paraucania = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 12 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Prios = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 13 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Plagos = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 14 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pcarlos = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 15 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    const Pantartica = await pool.query('SELECT users.fullname, auxTable.prov_id, auxTable.us_id, ROUND( auxTable.promedioFinal,1 ) AS promediofinal, auxTable.cantidad_de_servicios FROM users,(SELECT servicios.proveedor_id AS prov_id, servicios.user_id AS us_id, Avg(aValoraciones.promedio) AS promedioFinal, Avg(counterTable.counterr) AS cantidad_de_servicios FROM CServicio, servicios, cities, (SELECT servicio_id, Avg(valoracion) AS promedio FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicio_id) AS aValoraciones, (SELECT proveedor_id, Count(*) AS counterr FROM servicios WHERE id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY proveedor_id) AS counterTable WHERE CServicio.id_servicio = servicios.id AND CServicio.id_ciudad = cities.id_city AND cities.id_region = 16 AND aValoraciones.servicio_id = servicios.id AND counterTable.proveedor_id = servicios.proveedor_id GROUP BY servicios.proveedor_id, servicios.user_id) AS auxTable WHERE auxTable.us_id = users.id');
    //Total de "Servicios Disponibles" en cada region
    const Sarica = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 1 GROUP BY regions.id_region');
    const Starapaca = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 2 GROUP BY regions.id_region');
    const Santofagasta = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 3 GROUP BY regions.id_region');
    const Satacama = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 4 GROUP BY regions.id_region');
    const Scoquimbo = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 5 GROUP BY regions.id_region');
    const Svalparaiso = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 6 GROUP BY regions.id_region');
    const Smetropolitana = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 7 GROUP BY regions.id_region');
    const Sbernardo = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 8 GROUP BY regions.id_region');
    const Smaule = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 9 GROUP BY regions.id_region');
    const Sñuble = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 10 GROUP BY regions.id_region');
    const Sbiobio = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 11 GROUP BY regions.id_region');
    const Saraucania = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 12 GROUP BY regions.id_region');
    const Srios = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 13 GROUP BY regions.id_region');
    const Slagos = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 14 GROUP BY regions.id_region');
    const Scarlos = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 15 GROUP BY regions.id_region');
    const Santartica = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 16 GROUP BY regions.id_region');
    //Promedio de "Valoracion General" en cada region
    const Varica = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "1" GROUP BY regionServ.reg_id');
    const Vtarapaca = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "2" GROUP BY regionServ.reg_id');
    const Vantofagasta = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "3" GROUP BY regionServ.reg_id');
    const Vatacama = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "4" GROUP BY regionServ.reg_id');
    const Vcoquimbo = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "5" GROUP BY regionServ.reg_id');
    const Vvalparaiso = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "6" GROUP BY regionServ.reg_id');
    const Vmetropolitana = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "7" GROUP BY regionServ.reg_id');
    const Vbernardo = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "8" GROUP BY regionServ.reg_id');
    const Vmaule = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "9" GROUP BY regionServ.reg_id');
    const Vñuble = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "10" GROUP BY regionServ.reg_id');
    const Vbiobio = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "11" GROUP BY regionServ.reg_id');
    const Varaucania = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "12" GROUP BY regionServ.reg_id');
    const Vrios = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "13" GROUP BY regionServ.reg_id');
    const Vlagos = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "14" GROUP BY regionServ.reg_id');
    const Vcarlos = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "15" GROUP BY regionServ.reg_id');
    const Vantartica = await pool.query('SELECT regionServ.reg_id AS regionID, Avg(valoraciones.valoracion) AS valoRegion, Count(*) AS cantidadValoraciones FROM valoraciones,(SELECT servicios.id AS serv_id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE valoraciones.servicio_id = regionServ.serv_id AND regionServ.reg_id = "16" GROUP BY regionServ.reg_id');
    //Cantidad total de "Proveedores" en cada region
    const Carica = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "1" GROUP BY regId');
    const Ctarapaca = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "2" GROUP BY regId');
    const Cantofagasta = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "3" GROUP BY regId');
    const Catacama = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "4" GROUP BY regId');
    const Ccoquimbo = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "5" GROUP BY regId');
    const Cvalparaiso = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "6" GROUP BY regId');
    const Cmetropolitana = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "7" GROUP BY regId');
    const Cbernardo = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "8" GROUP BY regId');
    const Cmaule = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "9" GROUP BY regId');
    const Cñuble = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "10" GROUP BY regId');
    const Cbiobio = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "11" GROUP BY regId');
    const Caraucania = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "12" GROUP BY regId');
    const Crios = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "13" GROUP BY regId');
    const Clagos = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "14" GROUP BY regId');
    const Ccarlos = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "15" GROUP BY regId');
    const Cantartica = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "16" GROUP BY regId');


    res.render('admins/Dashboard', { arica,tarapaca,antofagasta, atacama,coquimbo,valparaiso,metropolitana,bernardo,maule,ñuble,biobio,araucania,rios,lagos,carlos,antartica,Narica,Ntarapaca,Nantofagasta, Natacama,Ncoquimbo,Nvalparaiso,Nmetropolitana,Nbernardo,Nmaule,Nñuble,Nbiobio,Naraucania,Nrios,Nlagos,Ncarlos,Nantartica,Parica,Ptarapaca,Pantofagasta, Patacama,Pcoquimbo,Pvalparaiso,Pmetropolitana,Pbernardo,Pmaule,Pñuble,Pbiobio,Paraucania,Prios,Plagos,Pcarlos,Pantartica, Sarica,Starapaca,Santofagasta, Satacama,Scoquimbo,Svalparaiso,Smetropolitana,Sbernardo,Smaule,Sñuble,Sbiobio,Saraucania,Srios,Slagos,Scarlos,Santartica,Varica,Vtarapaca,Vantofagasta, Vatacama,Vcoquimbo,Vvalparaiso,Vmetropolitana,Vbernardo,Vmaule,Vñuble,Vbiobio,Varaucania,Vrios,Vlagos,Vcarlos,Vantartica,Carica,Ctarapaca,Cantofagasta, Catacama,Ccoquimbo,Cvalparaiso,Cmetropolitana,Cbernardo,Cmaule,Cñuble,Cbiobio,Caraucania,Crios,Clagos,Ccarlos,Cantartica });
});

module.exports = router;