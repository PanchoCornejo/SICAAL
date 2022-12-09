const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isProveedor } = require('../lib/auth');

const uploadFile = require('../lib/multer')

const path = require('path');
const fs = require('fs');
const { Console } = require('console');


// Donde puede el Proveedor: publicar una solicitud de su servicio.
router.get('/publicar',isProveedor , async(req, res) => {
    const id = req.user.id;
    const midata = await pool.query('SELECT proveedor.direccion from proveedor, users where proveedor.user_id = users.id AND users.id = ?', [id]);
    if(midata[0] == null){
        console.log("No hay datos");
        res.redirect('/panelP/perfilP')
    }
    else{
        console.log("Hay datos");
        const regiones = await pool.query('SELECT id_region, name FROM regions;');
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
        const categorias = await pool.query('SELECT id, nombre FROM categoria');
        res.render('proveedores/publicar', {categorias ,regiones,arica, tarapaca, antofagasta, atacama, coquimbo, valparaiso, metropolitana, bernardo, maule, ñuble,biobio, araucania,rios,lagos,carlos,antartica});
    }
});

// Donde puede el Proveedor: revisa sus publicaciones (activas) y eliminarlas.
router.get('/misserviciosA', isProveedor, async (req, res) => {
    const id = req.user.id;
    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [id]);
    if (result.length != 0){
        const proveedor_id = result[0].id;
        console.log("esta aca?")
        // console.log(id);
        const datos = await pool.query('SELECT * FROM servicios WHERE servicios.proveedor_id = ? AND estado_publicacion = "archivado"', [proveedor_id]);
        // console.log(servicios);
        res.render('proveedores/misserviciosA', {datos});
    }else{
        res.render('proveedores/misserviciosA',{});
    }
    
});

router.post('/misserviciosA',isProveedor,  async function(req, res, next){
    console.log("Post de misServicios Archivados para ir a Activar")
    const { VALid } = req.body;
    let IDD = {
        VALid
    };
    await pool.query('UPDATE servicios set estado_publicacion = "pendiente" WHERE servicios.id = ?', [IDD.VALid]);
    res.redirect('/panelP/perfilP');
});

router.post('/misservicios', isProveedor, async function(req, res, next){
    console.log("Post de misServicios para ir a Modificar")

    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [req.user.id]);
    const user_id = req.user.id;
    console.log("La cosa es:"+result[0].id);
    const proveedor_id = result[0].id;
    console.log(req.body);
    const { VALid, nombre, marca, ano, modelo, horometro, operador, region, ciudades, estado, categoria, description} = req.body;
    console.log("Regiones en las que Opera");
    console.log(region);
    console.log("Ciudades que trabajamos");
    console.log(ciudades);

    //Por defecto viene en pendiente, para que no se publique de una
    const estado_publicacion = 'pendiente';
    let DatosP = {
        VALid,
        user_id,
        proveedor_id,
        nombre,
        marca,
        ano,
        modelo,
        horometro,
        operador,
        estado,
        categoria,
        description
    };
    // console.log(DatosP)

    const regiones = await pool.query('SELECT id_region, name FROM regions;');
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

    const categorias = await pool.query('SELECT id, nombre FROM categoria');

    res.render('proveedores/modificar', {categorias, DatosP , regiones,arica, tarapaca, antofagasta, atacama, coquimbo, valparaiso, metropolitana, bernardo, maule, ñuble,biobio, araucania,rios,lagos,carlos,antartica});
});

// Donde puede el Proveedor: revisa sus publicaciones (Archivado) y las puede reactivar (a pendiente) o modificar.
router.get('/misservicios', isProveedor, async (req, res) => {

    const id = req.user.id;
    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [id]);
    if (result.length != 0){
        const proveedor_id = result[0].id;
        console.log("esta aca?")
        // console.log(id);
        const datos = await pool.query('SELECT * FROM servicios WHERE servicios.proveedor_id = ? AND (estado_publicacion = "aprobado"  OR estado_publicacion = "pendiente" OR estado_publicacion = "rechazado")', [proveedor_id]);
        // console.log(servicios);
        res.render('proveedores/misservicios', {datos});
    }else{
        res.render('proveedores/misservicios',{});
    }
    
});

// Donde puede el Proveedor: mirar su perfil.
router.get('/perfilP',isProveedor, async (req, res) => {

    console.log("-------------------")
    // console.log("Te dare los datos: " + req.user.id)
    const id = req.user.id;
    // console.log("la id es: " +id)
    const datos = await pool.query('SELECT * FROM proveedor WHERE user_id = ?', [id]);
    // console.log("Datos de la Consulta SQL");
    // console.log(datos);
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
        user_id: id,
        
    };
    await pool.query('INSERT INTO proveedor set ?', [DatosP]);
    req.flash('Correcto!', 'Datos Creados Correctamente');
    res.redirect('/panelP/perfilP');
});


router.post('/publicar', uploadFile(), async function(req, res, next){
    // console.log(req.user.proveedor_id);

    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [req.user.id]);
    const user_id = req.user.id;
    
    if (!Object.values(result[0]).includes('id')) {
        res.redirect('/panelP/perfilP');
    }
    const proveedor_id = result[0].id;

    const { nombre, marca, ano, modelo, horometro, operador, region, ciudades, estado, categoria, description} = req.body;


    //Por defecto viene en pendiente, para que no se publique de una
    const estado_publicacion = 'pendiente';
    let DatosP = {
        user_id,
        proveedor_id,
        nombre,
        marca,
        ano,
        modelo,
        horometro,
        operador,
        estado,
        categoria,
        description,
        estado_publicacion,
        dominio_de_la_maquina:'',
        revision_tecnica:'',
        permiso_de_circulacion:'',
        seguro:'',
        documentacion_operador:'',
        foto:''

    };
    // console.log(DatosP);
    const uploadQuery = await pool.query('INSERT INTO servicios set ?', [DatosP]);

    const servicio_id = uploadQuery.insertId;

    const paths = {};

    if (req.files.domMaq) {

        const oldPath = req.files.domMaq[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.domMaq[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.domMaq[0].filename);
        paths.dominio_de_la_maquina = bddpath; 

        
    } else {
        paths.dominio_de_la_maquina = 'null';  
    }
    if (req.files.revTec) {
        const oldPath = req.files.revTec[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.revTec[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.revTec[0].filename);
        paths.revision_tecnica = bddpath; 

    } else {
        paths.revision_tecnica = 'null';   
    }

    if (req.files.perCir) {
        
        const oldPath = req.files.perCir[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.perCir[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.perCir[0].filename);
        paths.permiso_de_circulacion = bddpath; 

    } else {
        paths.permiso_de_circulacion = 'null';
    }

    if (req.files.seg) {
        
        const oldPath = req.files.seg[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.seg[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.seg[0].filename);
        paths.seguro = bddpath; 

        
    } else {
        paths.seguro = 'null'
    }

    if (req.files.docOpe) {
        
        const oldPath = req.files.docOpe[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.docOpe[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.docOpe[0].filename);
        paths.documentacion_operador = bddpath; 

        
    } else {
        paths.documentacion_operador = 'null';
    }

    if (req.files.fot) {
        
        const oldPath = req.files.fot[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.fot[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.fot[0].filename);
        paths.foto = bddpath;

        
    } else {
        paths.foto = path.join('/img/' + 'background.jpeg');
    }

    console.log(ciudades);

    await pool.query('UPDATE servicios SET ? WHERE servicios.id = ?',[paths,servicio_id]);

    

    if (ciudades) {
        const mergedArray = [];
        await pool.query('DELETE FROM CServicio WHERE id_servicio = ?', [servicio_id]);
        if (Array.isArray(ciudades)) {
            var id_ciudad = ciudades.map(function (x) { 
                return parseInt(x, 10); 
            });
            id_ciudad.forEach((element,index )=> {
                let tempArray = [];
                tempArray.push(servicio_id);
                tempArray.push(element);
                mergedArray.push(tempArray);
            });
            console.log('ss')
            await pool.query('INSERT INTO CServicio (id_servicio, id_ciudad) VALUES ?',[mergedArray]); 
        } else {

            let tempArray = [];
            tempArray.push(servicio_id);
            tempArray.push(ciudades);
            mergedArray.push(tempArray);
            console.log(mergedArray)
            await pool.query('INSERT INTO CServicio (id_servicio, id_ciudad) VALUES ?',[mergedArray]); 
        }
     
    } else {
        console.log('¡No hay ciudades seleccionadas!')
    }



    req.flash('¡Correcto!', 'Servicio creado correctamente.');
    res.redirect('/panelP/perfilP');
});



// Post de un Servicio Modificado!!!

router.post('/modificar', uploadFile(), async function(req, res, next){

    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [req.user.id]);
    const user_id = req.user.id;

    const proveedor_id = result[0].id;
    const { VALid, nombre, marca,  modelo, horometro, operador, region, ciudades, estado, categoria, description} = req.body;
    const ano = parseInt(req.body.ano);
    const servicio_id =  VALid;
    console.log("Estamos Modificandoel servicio: ",servicio_id)
    const datosOriginales = await pool.query('SELECT * FROM servicios WHERE id = ?',[servicio_id]);

    
    //Por defecto viene en pendiente, para que no se publique de una
    const estado_publicacion = 'pendiente';

    let DatosP = {
        user_id,
        proveedor_id,
        nombre,
        marca,
        ano,
        modelo,
        horometro,
        operador,
        estado,
        categoria,
        description,
        estado_publicacion,
        dominio_de_la_maquina:'',
        revision_tecnica:'',
        permiso_de_circulacion:'',
        seguro:'',
        documentacion_operador:'',
        foto:''

    };

    // const uploadQuery = await pool.query('UPDATE INTO servicios set ? Where id=?', [DatosP, idd.VALid]);
    const datosBDD = datosOriginales[0];

    // Se comparan los datos para ver si se modifica

    const datosModificar = {}

    if (DatosP.nombre === datosBDD.nombre) {
        console.log('Se mantiene: ', Object.keys({nombre})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({nombre})[0])
        datosModificar.nombre = DatosP.nombre;
    }
    if (DatosP.marca === datosBDD.marca) {
        console.log('Se mantiene: ', Object.keys({marca})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({marca})[0])
        datosModificar.marca = DatosP.marca;
    }
    if (DatosP.ano === datosBDD.ano) {
        console.log('Se mantiene: ', Object.keys({ano})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({ano})[0])
        datosModificar.ano = DatosP.ano;
    }
    if (DatosP.modelo === datosBDD.modelo) {
        console.log('Se mantiene: ', Object.keys({modelo})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({modelo})[0])
        datosModificar.modelo = DatosP.modelo;
    }
    if (DatosP.horometro === datosBDD.horometro) {
        console.log('Se mantiene: ', Object.keys({horometro})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({horometro})[0])
        datosModificar.horometro = DatosP.horometro;
    }
    if (DatosP.operador === datosBDD.operador) {
        console.log('Se mantiene: ', Object.keys({operador})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({operador})[0])
        datosModificar.operador = DatosP.operador;
    }
    if (DatosP.categoria === datosBDD.categoria) {
        console.log('Se mantiene: ', Object.keys({categoria})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({categoria})[0])
        datosModificar.categoria = DatosP.categoria;
    }
    if (DatosP.description === datosBDD.description) {
        console.log('Se mantiene: ', Object.keys({description})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({description})[0])
        datosModificar.description = DatosP.description;
    }
    if (DatosP.estado === datosBDD.estado) {
        console.log('Se mantiene: ', Object.keys({estado})[0])
        
    } else {
        console.log('Se cambia: ', Object.keys({estado})[0])
        datosModificar.estado = DatosP.estado;
    }
    const oldPaths = {};
    oldPaths.dominio_de_la_maquina = datosBDD.dominio_de_la_maquina;
    oldPaths.revision_tecnica = datosBDD.revision_tecnica;
    oldPaths.permiso_de_circulacion = datosBDD.permiso_de_circulacion;
    oldPaths.seguro = datosBDD.seguro;
    oldPaths.documentacion_operador = datosBDD.documentacion_operador;
    oldPaths.foto = datosBDD.foto;

    const paths = {};

    if (req.files.domMaq) {

        const oldPath = req.files.domMaq[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.domMaq[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.domMaq[0].filename);
        paths.dominio_de_la_maquina = bddpath; 

        
    } else {
        paths.dominio_de_la_maquina = oldPaths.dominio_de_la_maquina;  
    }
    if (req.files.revTec) {
        const oldPath = req.files.revTec[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.revTec[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.revTec[0].filename);
        paths.revision_tecnica = bddpath; 

    } else {
        paths.revision_tecnica = oldPaths.revision_tecnica;   
    }

    if (req.files.perCir) {
        
        const oldPath = req.files.perCir[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.perCir[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.perCir[0].filename);
        paths.permiso_de_circulacion = bddpath; 

    } else {
        paths.permiso_de_circulacion = oldPaths.permiso_de_circulacion;
    }

    if (req.files.seg) {
        
        const oldPath = req.files.seg[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.seg[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.seg[0].filename);
        paths.seguro = bddpath; 

        
    } else {
        paths.seguro = oldPaths.seguro;
    }

    if (req.files.docOpe) {
        
        const oldPath = req.files.docOpe[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.docOpe[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.docOpe[0].filename);
        paths.documentacion_operador = bddpath; 

        
    } else {
        paths.documentacion_operador = oldPaths.documentacion_operador;
    }

    if (req.files.fot) {
        
        const oldPath = req.files.fot[0].path;

        const newPath = path.join(__dirname, '../../storage/' + proveedor_id + '/' + servicio_id);

        fs.mkdirSync(newPath, { recursive: true });

        const newPathN = path.join(newPath, req.files.fot[0].filename);


        fs.rename(oldPath, newPathN, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        const bddpath = path.join('/files/' + proveedor_id + '/' + servicio_id +'/' +req.files.fot[0].filename);
        paths.foto = bddpath;

        
    } else {
        paths.foto = oldPaths.foto;
    }

    console.log(paths)
    await pool.query('UPDATE servicios SET ? WHERE servicios.id = ?',[paths,servicio_id]);
    
    if (Object.entries(datosModificar).length !== 0) {
        await pool.query('UPDATE servicios SET ? WHERE servicios.id = ?',[datosModificar,servicio_id]);
    }
    
    
    await pool.query('DELETE FROM CServicio WHERE id_servicio = ?', [servicio_id]);

    
    if (ciudades) {
        const mergedArray = [];
        await pool.query('DELETE FROM CServicio WHERE id_servicio = ?', [servicio_id]);
        if (Array.isArray(ciudades)) {
            var id_ciudad = ciudades.map(function (x) { 
                return parseInt(x, 10); 
            });
            id_ciudad.forEach((element,index )=> {
                let tempArray = [];
                tempArray.push(servicio_id);
                tempArray.push(element);
                mergedArray.push(tempArray);
            });
            console.log('ss')
            await pool.query('INSERT INTO CServicio (id_servicio, id_ciudad) VALUES ?',[mergedArray]); 
        } else {

            let tempArray = [];
            tempArray.push(servicio_id);
            tempArray.push(ciudades);
            mergedArray.push(tempArray);
            console.log(mergedArray)
            await pool.query('INSERT INTO CServicio (id_servicio, id_ciudad) VALUES ?',[mergedArray]); 
        }
     
    } else {
        console.log('¡No hay ciudades seleccionadas!')
    }


    req.flash('¡Correcto!', 'Servicio Modificado correctamente.');
    res.redirect('/panelP/misservicios');
});








router.get('/testeando',(req,res)=>{
    console.log(__dirname + '/../../storage/5/domMaq')
    res.send("url testeando")
})

router.post('/baja',async (req,res)=>{
    //Dar de baja significa eliminar el servicio
    const {id} = req.body

    const borrar = await pool.query(`update servicios set estado_publicacion = 'archivado' where id = ${id};`);


    res.send({msg : 'me diste de baja', id : id})
})

router.post('/mod', async (req,res) => {

    const { id } = req.body
    const data = await pool.query(`select * from servicios where id = ${id}`)

    res.send({response : 'modificacion servicio', id : id, data : data})
})


module.exports = router;
