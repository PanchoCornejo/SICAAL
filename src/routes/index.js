const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/solicitud', async (req, res) => {
    res.render('./solicitud');
});

router.get('/pruebas', async (req, res) => {
    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
    const ciudades = await pool.query('SELECT id_city, name FROM cities');
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
    res.render('./pruebas', { datos : datos , regiones :regiones , ciudades, arica, tarapaca, antofagasta, atacama, coquimbo, valparaiso, metropolitana, bernardo, maule, ñuble,biobio, araucania,rios,lagos,carlos,antartica});
});

router.get('/servicios', async (req, res) => {
    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
    const ciudades = await pool.query('SELECT id_city, name FROM cities');
    const regiones = await pool.query('SELECT id_region, name FROM regions;');
    res.render('./servicios', { datos : datos , regiones :regiones , ciudades});
});

router.post('/servicios2', async (req, res) => {
    const { region } = req.body;
    const soli = {
        region
    };
    console.log("POST de Solicitud2")
    console.log(soli);
    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
    const ciudades = await pool.query('SELECT id_city, name FROM cities');
    const regiones = await pool.query('SELECT id_region, name FROM regions;');
    if (soli.region == "Región de Arica y Parinacota"){
        const arica = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="1"');
        console.log("tambien por aqui")
        res.render('./servicios', { datos : datos , regiones :regiones , arica: arica});
    }
    else if (soli.region == "Región de Tarapacá"){
        const tarapaca = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="2"');
        console.log(tarapaca);
        res.render('./servicios', { datos : datos , regiones :regiones , tarapaca: tarapaca});
    }
    else if (soli.region == "Región de Antofagasta"){
        const antofagasta = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="3"');
        res.render('./servicios', { datos : datos , regiones :regiones , antofagasta})
    }
    else if (soli.region == "Región de Atacama"){
        const atacama = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="4"');
        res.render('./servicios', { datos : datos , regiones :regiones , atacama})
    }
    else if (soli.region == "Región de Coquimbo"){
        const coquimbo = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="5"');
        res.render('./servicios', { datos : datos , regiones :regiones , coquimbo})
    }
    else if (soli.region == "Región de Valparaíso"){
        const valparaiso = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="6"');
        res.render('./servicios', { datos : datos , regiones :regiones , valparaiso})
    }
    else if (soli.region == "Región Metropolitana de Santiago"){
        const metropolitana = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="7"');
        res.render('./servicios', { datos : datos , regiones :regiones , metropolitana})
    }
    else if (soli.region == "Región del Libertador General Bernardo O'Higgins"){
        const bernardo = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="8"');
        res.render('./servicios', { datos : datos , regiones :regiones , bernardo})
    }
    else if (soli.region == "Región del Maule"){
        const maule = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="9"');
        res.render('./servicios', { datos : datos , regiones :regiones , maule})
    }
    else if (soli.region == "Región de Ñuble"){
        const ñuble = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="10"');
        res.render('./servicios', { datos : datos , regiones :regiones , ñuble})
    }
    else if (soli.region == "Región del Biobío"){
        const biobio = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="11"');
        res.render('./servicios', { datos : datos , regiones :regiones , biobio})
    }
    else if (soli.region == "Región de La Araucanía"){
        const araucania = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="12"');
        res.render('./servicios', { datos : datos , regiones :regiones , araucania})
    }
    else if (soli.region == "Región de Los Ríos"){
        const rios = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="13"');
        res.render('./servicios', { datos : datos , regiones :regiones , rios})
    }
    else if (soli.region == "Región de Los Lagos"){
        const lagos = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="14"');
        res.render('./servicios', { datos : datos , regiones :regiones , lagos})
    }
    else if (soli.region == "Región Aysén del General Carlos Ibáñez del Campo"){
        const carlos = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="15"');
        res.render('./servicios', { datos : datos , regiones :regiones , carlos})
    }
    else if (soli.region == "Región de Magallanes y de la Antártica Chilena"){
        const antartica = await pool.query('SELECT id_city, id_region, name FROM cities WHERE id_region="16"');
        res.render('./servicios', { datos : datos , regiones :regiones , antartica})
    }
    else{
        console.log("no deberia esta aqui")
    }
});


router.post('/solicitud', async (req, res) => {
    const { empresa , nombre , numero , ubicacion , tipo } = req.body;
    const soli = {
        empresa,
        nombre,
        numero,
        ubicacion,
        tipo
    };
    console.log(soli);
    await pool.query('INSERT INTO Sproveedor set empresanombre = ?, contactonombre = ?, numero = ?, ubicacion = ?, tipo = ?', [soli.empresa,soli.nombre,soli.numero,soli.ubicacion,soli.tipo]);
    req.flash('Logrado', 'Datos enviados Correctamente');
    res.redirect('/');
});
module.exports = router;