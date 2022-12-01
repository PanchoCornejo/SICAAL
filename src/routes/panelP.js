const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isProveedor } = require('../lib/auth');

const uploadFile = require('../lib/multer')

const path = require('path');
const fs = require('fs');


// Donde puede el Proveedor: publicar una solicitud de su servicio.
router.get('/publicar',isProveedor , async(req, res) => {

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
    
    res.render('proveedores/publicar', {regiones,arica, tarapaca, antofagasta, atacama, coquimbo, valparaiso, metropolitana, bernardo, maule, ñuble,biobio, araucania,rios,lagos,carlos,antartica});
});

// Donde puede el Proveedor: revisa sus publicaciones (activas) y eliminarlas.
router.get('/misservicios', isProveedor, async (req, res) => {

    const id = req.user.id;
    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [id]);
    if (result.length != 0){
        const proveedor_id = result[0].id;
        console.log("esta aca?")
        // console.log(id);
        const datos = await pool.query('SELECT * FROM servicios WHERE servicios.proveedor_id = ?', [proveedor_id]);
        // console.log(servicios);
        res.render('proveedores/misservicios', {datos});
    }else{
        res.render('proveedores/misservicios',{});
    }
    
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
        user_id: id,
        
    };
    await pool.query('INSERT INTO proveedor set ?', [DatosP]);
    req.flash('Correcto!', 'Datos Creados Correctamente');
    res.redirect('/panelP/perfilP');
});


/*
router.post('/publicar2', async (req, res) => {
    
    console.log("Estamos viendo que ciudades mostramos")
    console.log(req.body)
    const { region } = req.body;
    for (let i = 0; i < 16; i++) {
        if(region[i]== 'Región de Arica y Parinacota'){
            const arica = await pool.query('SELECT name FROM cities WHERE id_region="1"');
        }
        if(region[i]== 'Región de Tarapacá'){
            const tarapaca = await pool.query('SELECT name FROM cities WHERE id_region="2"');
        }
        if(region[i]== 'Región de Antofagasta'){
            const antofagasta = await pool.query('SELECT name FROM cities WHERE id_region="3"');
        }
        if(region[i]== 'Región de Atacama'){
            const atacama = await pool.query('SELECT name FROM cities WHERE id_region="4"');
        }
        if(region[i]== 'Región de Coquimbo'){
            const coquimbo = await pool.query('SELECT name FROM cities WHERE id_region="5"');
        }
        if(region[i]== 'Región de Valparaíso'){
            const valparaiso = await pool.query('SELECT name FROM cities WHERE id_region="6"');
        }
        if(region[i]== 'Región Metropolitana de Santiago'){
            const metropolitana = await pool.query('SELECT name FROM cities WHERE id_region="7"');
        }
        if(region[i]== "Región del Libertador General Bernardo O'Higgins"){
            const bernardo = await pool.query('SELECT name FROM cities WHERE id_region="8"');
        }
        if(region[i]== 'Región del Maule'){
            const maule = await pool.query('SELECT name FROM cities WHERE id_region="9"');
        }
        if(region[i]== 'Región de Ñuble'){
            const ñuble = await pool.query('SELECT name FROM cities WHERE id_region="10"');
        }
        if(region[i]== 'Región del Biobío'){
            const biobio = await pool.query('SELECT name FROM cities WHERE id_region="11"');
        }
        if(region[i]== 'Región de La Araucanía'){
            const araucania = await pool.query('SELECT name FROM cities WHERE id_region="12"');
        }
        if(region[i]== 'Región de Los Ríos'){
            const rios = await pool.query('SELECT name FROM cities WHERE id_region="13"');
        }
        if(region[i]== 'Región de Los Lagos'){
            const lagos = await pool.query('SELECT name FROM cities WHERE id_region="14"');
        }
        if(region[i]== 'Región Aysén del General Carlos Ibáñez del Campo'){
            const carlos = await pool.query('SELECT name FROM cities WHERE id_region="15"');
        }
        if(region[i]== 'Región de Magallanes y de la Antártica Chilena'){
            const antartica = await pool.query('SELECT name FROM cities WHERE id_region="16"');
        }
        ;
        
      }
      const regiones = await pool.query('SELECT name FROM regions;')
      res.render('proveedores/publicar', {regiones, arica, tarapaca, antofagasta, atacama, coquimbo, valparaiso, metropolitana, bernardo, maule, ñuble,biobio, araucania,rios,lagos,carlos,antartica});
});

*/

router.post('/publicar', uploadFile(), async function(req, res, next){
    // console.log(req.user.proveedor_id);
    console.log("----aca-----")

    let result = await pool.query('SELECT proveedor.id from proveedor, users WHERE users.id = ? AND proveedor.user_id = users.id;', [req.user.id]);
    const user_id = req.user.id;
    console.log("La cosa es:"+result[0].id);
    const proveedor_id = result[0].id;
    // console.log(req.body);
    const { nombre, marca, ano, modelo, horometro, operador, region, ciudades, estado, categoria, description} = req.body;
    console.log("Regiones en las que Opera");
    console.log(region);
    console.log("Ciudades que trabajamos");
    console.log(ciudades);

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
    console.log(DatosP);
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
        paths.dominio_de_la_maquina = newPathN;

        
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
        paths.revision_tecnica = newPathN;

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
        paths.permiso_de_circulacion = newPathN;

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
        paths.seguro = newPathN;

        
    } else {
        paths.seguro = 'null';
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
        paths.documentacion_operador = newPathN;

        
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
        paths.foto = newPathN;

        
    } else {
        paths.foto = 'null';
    }

    await pool.query('UPDATE servicios SET ? WHERE servicios.id = ?',[paths,servicio_id]);


    var id_ciudad = ciudades.map(function (x) { 
        return parseInt(x, 10); 
    });

    const mergedArray = [];

    id_ciudad.forEach((element,index )=> {
        let tempArray = [];
        tempArray.push(servicio_id);
        tempArray.push(element);
        mergedArray.push(tempArray);
    });

    await pool.query('INSERT INTO CServicio (id_servicio, id_ciudad) VALUES ?',[mergedArray]);


    req.flash('¡Correcto!', 'Servicio creado correctamente.');
    res.redirect('/panelP/perfilP');
});

router.get('/testeando',(req,res)=>{
    console.log(__dirname + '/../../storage/5/domMaq')
    res.send("url testeando")
})

router.post('/baja',async (req,res)=>{
    //Dar de baja significa eliminar el servicio
    const {id} = req.body

    const borrar = await pool.query(`DELETE FROM servicios WHERE id = ${id}`);


    res.send({msg : 'me diste de baja', id : id})
})

module.exports = router;
