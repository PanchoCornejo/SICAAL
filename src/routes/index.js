const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/solicitud', async (req, res) => {
    res.render('./solicitud');
});

router.get('/servicios', async (req, res) => {

    const regiones = await pool.query('SELECT id_region, name FROM regions;');
    const ciudades = await pool.query('SELECT id_city, name FROM cities');
    const categoria = await pool.query('SELECT nombre FROM categoria');
    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
    //const valor = await pool.query('SELECT servicio_id, AVG(valoracion) as General,AVG(Voperador) as Operador,AVG(Vpuntualidad) as Puntualidad,AVG(Vexperiencia) as Experiencia, AVG(Vfallas) as Fallas, AVG(Vestadomaquina) as Estadomaquina FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios where estado_publicacion = "aprobado") GROUP BY servicio_id;');
    
    res.render('./servicios', {datos : datos, regiones, ciudades ,categoria});
});

router.post('/servicios', async (req, res) => {
    const { region, ciudad, operador, cat } = req.body;
    const soli = {
        region,
        ciudad,
        operador,
        cat
    };
    console.log(soli);
    if(soli.ciudad != "---"){
        if(soli.operador == "Si"){
            if(soli.cat != "---"){
                const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
                const regiones = await pool.query('SELECT id_region, name FROM regions;');
                const ciudades = await pool.query('SELECT id_city, name FROM cities');
                const categoria = await pool.query('SELECT nombre FROM categoria');
                res.render('./servicios', {datos, regiones, ciudades ,categoria});
            }
            else{
                const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
                const regiones = await pool.query('SELECT id_region, name FROM regions;');
                const ciudades = await pool.query('SELECT id_city, name FROM cities');
                const categoria = await pool.query('SELECT nombre FROM categoria');
                res.render('./servicios', {datos, regiones, ciudades ,categoria});
            }
        } 
        else if (soli.operador == "No"){
            if(soli.cat != "---"){
                const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
                const regiones = await pool.query('SELECT id_region, name FROM regions;');
                const ciudades = await pool.query('SELECT id_city, name FROM cities');
                const categoria = await pool.query('SELECT nombre FROM categoria');
                res.render('./servicios', {datos, regiones, ciudades ,categoria});
            }
            else{
                const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
                const regiones = await pool.query('SELECT id_region, name FROM regions;');
                const ciudades = await pool.query('SELECT id_city, name FROM cities');
                const categoria = await pool.query('SELECT nombre FROM categoria');
                res.render('./servicios', {datos, regiones, ciudades ,categoria});
            }
        }
        else{
            if(soli.cat != "---"){
                const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
                const regiones = await pool.query('SELECT id_region, name FROM regions;');
                const ciudades = await pool.query('SELECT id_city, name FROM cities');
                const categoria = await pool.query('SELECT nombre FROM categoria');
                res.render('./servicios', {datos, regiones, ciudades ,categoria});
            }
            else{
                const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
                const regiones = await pool.query('SELECT id_region, name FROM regions;');
                const ciudades = await pool.query('SELECT id_city, name FROM cities');
                const categoria = await pool.query('SELECT nombre FROM categoria');
                res.render('./servicios', {datos, regiones, ciudades ,categoria});
            }
        }
    }
    else{
        if(soli.region != "---"){
            if(soli.operador == "Si"){
                if(soli.cat != "---"){
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
                else{
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
            }
            else if (soli.operador == "No"){
                if(soli.cat != "---"){
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
                else{
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
            }
            else{
                if(soli.cat != "---"){
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
                else{
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
            }
        }
        else {
            if(soli.operador == "Si"){
                if(soli.cat != "---"){
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado' AND operador= 'Si' AND categoria = ?", [soli.cat]);
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
                else{
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado' AND operador= 'Si'");
                    console.log(datos)
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
            }
            else if (soli.operador == "No"){
                if(soli.cat != "---"){
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado' AND operador= 'No' AND categoria = ?", [soli.cat]);
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
                else{
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado' AND operador= 'No'");
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
            }
            else{
                if(soli.cat != "---"){
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado' AND categoria = ?", [soli.cat]);
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
                else{
                    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
                    const regiones = await pool.query('SELECT id_region, name FROM regions;');
                    const ciudades = await pool.query('SELECT id_city, name FROM cities');
                    const categoria = await pool.query('SELECT nombre FROM categoria');
                    res.render('./servicios', {datos, regiones, ciudades ,categoria});
                }
            }
        }
    }
    
});

router.post('/detalle', async(req,res)=>{   
    
    const {id} = req.body
    const IDD = {
        id
    };

    //console.log("------- Detalles ---------", username)
    
    const datos = await pool.query(`select servicios.* from servicios where servicios.id = ${id}`);
    const valor = await pool.query('SELECT servicio_id, Round(Avg(valoracion), 1) AS general, Round(Avg(Voperador), 1) AS operador, Round(Avg(Vpuntualidad), 1) AS puntualidad, Round(Avg(Vexperiencia), 1) AS experiencia, Round(Avg(Vfallas), 1) AS fallas, Round(Avg(Vestadomaquina), 1) AS estadomaquina FROM valoraciones WHERE servicio_id IN(SELECT id FROM servicios WHERE estado_publicacion = "aprobado") AND servicio_id = ? GROUP BY servicio_id', [IDD.id]);
    const regiones = await pool.query('SELECT regions.name FROM CServicio, cities, servicios, regions WHERE CServicio.id_ciudad = cities.id_city AND CServicio.id_servicio = servicios.id AND cities.id_region = regions.id_region AND servicios.id = ? GROUP BY regions.name', [IDD.id]);
    console.log(datos,valor)
    console.log(regiones)
    res.render('./serviciodetalle', {datos, valor, regiones})
})



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




module.exports = router;





