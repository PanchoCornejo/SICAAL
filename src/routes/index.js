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

       
    const datos = await pool.query("SELECT * FROM servicios where estado_publicacion = 'aprobado'");
    //const valor = await pool.query('SELECT servicio_id, AVG(valoracion) as General,AVG(Voperador) as Operador,AVG(Vpuntualidad) as Puntualidad,AVG(Vexperiencia) as Experiencia, AVG(Vfallas) as Fallas, AVG(Vestadomaquina) as Estadomaquina FROM valoraciones WHERE servicio_id IN (SELECT id FROM servicios where estado_publicacion = "aprobado") GROUP BY servicio_id;');
    
    res.render('./servicios', {datos : datos});
});

router.post('/detalle', async(req,res)=>{   
    
    const {id} = req.body
    const IDD = {
        id
    };

    //console.log("------- Detalles ---------", username)
    
    const datos = await pool.query(`select servicios.* from servicios where servicios.id = ${id}`);
    const valor = await pool.query('SELECT servicio_id, Round(Avg(valoracion), 1) AS general, Round(Avg(Voperador), 1) AS operador, Round(Avg(Vpuntualidad), 1) AS puntualidad, Round(Avg(Vexperiencia), 1) AS experiencia, Round(Avg(Vfallas), 1) AS fallas, Round(Avg(Vestadomaquina), 1) AS estadomaquina FROM valoraciones WHERE servicio_id IN(SELECT id FROM servicios WHERE estado_publicacion = "aprobado") AND servicio_id = ? GROUP BY servicio_id', [IDD.id]);
    console.log(datos,valor)
    res.render('./serviciodetalle', {datos, valor})
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


module.exports = router;