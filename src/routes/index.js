const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    const Svalparaiso = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 6 GROUP BY regions.id_region');
    const Smetropolitana = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 7 GROUP BY regions.id_region');
    const Sbernardo = await pool.query('SELECT regions.id_region, regions.NAME, Count(*) AS cantidad FROM regions,(SELECT servicios.id, cities.id_region AS reg_id FROM servicios, CServicio, cities WHERE servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad AND servicios.id IN (SELECT id FROM servicios WHERE estado_publicacion = "aprobado") GROUP BY servicios.id, cities.id_region) AS regionServ WHERE regionServ.reg_id = regions.id_region AND regions.id_region = 8 GROUP BY regions.id_region');
    const Cvalparaiso = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "6" GROUP BY regId');
    const Cmetropolitana = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "7" GROUP BY regId');
    const Cbernardo = await pool.query('SELECT regId AS regionId, Count(*) AS cantidadProveedores FROM(SELECT proveedor.id, cities.id_region AS regId FROM proveedor, servicios, cities, CServicio WHERE proveedor.id = servicios.proveedor_id AND servicios.id = CServicio.id_servicio AND cities.id_city = CServicio.id_ciudad GROUP BY proveedor.id, cities.id_region) AS provReg WHERE regId = "8" GROUP BY regId');
    res.render('index', { Cbernardo, Cmetropolitana, Cvalparaiso, Sbernardo ,Smetropolitana,Svalparaiso});
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
    console.log("POST de SERVICIOS GENERALES")
    const {
        region,
        ciudad,
        operador,
        cat
    } = req.body;
    let sql = "SELECT * FROM cities, servicios, CServicio, regions WHERE(servicios.id = CServicio.id_servicio) AND (cities.id_city = CServicio.id_ciudad) AND (regions.id_region = cities.id_region) AND (servicios.estado_publicacion = 'aprobado') "

    let soli = {
        region,
        ciudad,
        operador,
        cat
    };

    if (soli.region !== "---" && soli.ciudad !== "---") {
        soli.region = "---"
        
        
    }

    console.log(soli);

    if (soli.region != "---") {
        const aux = sql.concat(' AND (regions.name = ?)');
        sql = aux;

    }
    if (soli.ciudad != "---") {
        const aux2 = sql.concat(' AND cities.id_city = ?');
        sql = aux2;

    }
    if (soli.operador == "Si" || soli.operador == "No") {
        const aux3 = sql.concat(' AND servicios.operador = ?');
        sql = aux3;

    }
    if (soli.cat != "---") {
        const aux4 = sql.concat(' AND servicios.categoria = ?');
        sql = aux4;
    }
    const aux5 = sql.concat('  GROUP BY servicios.id');
    sql = aux5;
    // console.log(sql)


    const regiones = await pool.query('SELECT id_region, name FROM regions;');
    const ciudades = await pool.query('SELECT id_city, name FROM cities');
    const categoria = await pool.query('SELECT nombre FROM categoria');

    let datos = '';

    if (soli.ciudad != "---") {
        if (soli.operador == "Si" || soli.operador == "No") {
            if (soli.cat != "---") {
                console.log(1)
                 datos = await pool.query(sql, [ciudad, operador, cat]);

            } else {
                 datos = await pool.query(sql, [ciudad, operador]);
                console.log(2)
            }
        } else {
            if (soli.cat != "---") {
                 datos = await pool.query(sql, [ciudad, cat]);
                console.log(3)
            } else {
                 datos = await pool.query(sql, [ciudad]);
                console.log(4)
            }
        }
    } else {
        if (soli.region != "---") {
            if (soli.operador == "Si" || soli.operador == "No") {
                if (soli.cat != "---") {
                     datos = await pool.query(sql, [region, operador, cat]);
                    console.log(5)
                } else {
                     datos = await pool.query(sql, [region, operador]);
                    console.log(6)
                }
            } else {
                if (soli.cat != "---") {
                     datos = await pool.query(sql, [region, cat]);
                    console.log(7)
                } else {
                     datos = await pool.query(sql, [region]);
                    console.log(8)
                }
            }
        } else {
            if (soli.operador == "Si" || soli.operador == "No") {
                if (soli.cat != "---") {
                     datos = await pool.query(sql, [operador, cat]);
                    console.log(9)
                } else {
                     datos = await pool.query(sql, [operador]);
                    console.log(10)
                }
            } else {
                console.log(11)
                 datos = await pool.query(sql, [cat]);

            }

        }
    }
    // console.log(datos);
    // console.log(regiones);
    // console.log(ciudades);
    // console.log(categoria);
    res.render('./servicios', {
        datos,
        regiones,
        ciudades,
        categoria
    });

});

router.post('/detalle', async(req,res)=>{   

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    
    //Si no existe el user muere la wea :O 
    //const username = req.user.id;
    if(req.user){
        username = req.user.id;
    }else{
        username = ''
    }
    

    const {id} = req.body
    const IDD = {
        id
    };

    
    
    const datos = await pool.query(`select servicios.* from servicios where servicios.id = ${id}`);
    let valor = await pool.query('SELECT servicio_id, Round(Avg(valoracion), 1) AS general, Round(Avg(Voperador), 1) AS operador, Round(Avg(Vpuntualidad), 1) AS puntualidad, Round(Avg(Vexperiencia), 1) AS experiencia, Round(Avg(Vfallas), 1) AS fallas, Round(Avg(Vestadomaquina), 1) AS estadomaquina FROM valoraciones WHERE servicio_id IN(SELECT id FROM servicios WHERE estado_publicacion = "aprobado") AND servicio_id = ? GROUP BY servicio_id', [IDD.id]);
    const regiones = await pool.query(`select DISTINCT regions.name from cities,CServicio,regions where regions.id_region = cities.id_region and cities.id_city = CServicio.id_ciudad and CServicio.id_servicio = ${id}`)
    
    if (isEmpty(valor) ){
        //console.log("esta vacio")
        valor = [{}]
        valor[0].userid = username + '/'+ id
        console.log(valor)
    }

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
})


router.post('/enviarsoli', async(req,res)=> {
    const {id,ser} = req.body;
    console.log("----")
    console.log(id,ser)
    const asd = await pool.query(`insert into Soliservicio (user_request,servicio) values (${id},${ser});`)
    res.send({response : 'ok'})
})



module.exports = router;