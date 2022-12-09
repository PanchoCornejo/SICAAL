const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isClient } = require('../lib/auth');


// Donde puede el cliente mira su cuenta
router.get('/Panel',isClient , async(req, res) => {
    const id = req.user.id;
    const datos = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const info = await pool.query(`select * from Clientes where id = ${id}`)
    console.log(info)
    
    res.render('Cliente/panel', {datos, info});
});

// Donde puede el cliente mira sus Ordenes y elige dar una valoracion
router.get('/misordenes', isClient , async(req, res) => {
    const id = req.user.id;
    console.log('Estamos por aqui!!!')
    const datos = await pool.query('SELECT * FROM orden WHERE user_id = ?', [id]);
    const servi = await pool.query('SELECT orden.id, servicios.nombre , servicios.description, servicios.foto FROM servicios, users , orden WHERE orden.user_id = users.id AND servicios.id = orden.servicio_id AND users.id = ?', [id]);
    console.log(servi)
    res.render('Cliente/misordenes', {servi});
});



// Donde puede el cliente entrega la valoracion correspondiente
router.get('/Evaluar/:id', isClient , async(req, res) => {
    const { id } = req.params;
    const VAL = {
        id
    };
    console.log("buscamos en la orden con ID: "+ id)
    const tiene = await pool.query('SELECT * FROM orden WHERE id = ?', [id]);
    console.log("Veremos si tiene evaluacion o no");
    console.log(tiene[0].valoracion_id);
    if (tiene[0].valoracion_id){
        console.log("Tiene una valoracion Previa");
        res.redirect('/Cliente/Panel');
    }
    else {
        console.log('Estamos EVALUANDO!!!')
        res.render('Cliente/Evaluar', {VAL});
    } 
});


router.post('/Evaluar', isClient, async (req, res) => {
    console.log("Estamos POST de Evaluacion")
    const { VALid, valoracion, valoracionoper ,valoracionpunt ,valoracionexp ,valoracionfallas ,valoracionestado ,description} = req.body;
    console.log(req.body);
    const Val = {
        VALid,
        valoracion,
        valoracionoper,
        valoracionpunt,
        valoracionexp,
        valoracionfallas,
        valoracionestado,
        description
    };
    const servid = await pool.query('SELECT servicio_id FROM orden WHERE id = ?', [VALid]);
    console.log(Val.valoracionoper);
    if (Val.valoracionoper!='0'){
        console.log("Tiene una valoracion en operador");
        const evaluando = await pool.query('INSERT INTO valoraciones set servicio_id = ? , valoracion = ?,  Voperador = ?, Vpuntualidad = ?, Vexperiencia = ?,Vfallas = ?, Vestadomaquina = ?, description = ?', [servid[0].servicio_id, Val.valoracion,Val.valoracionoper ,Val.valoracionpunt,Val.valoracionexp,Val.valoracionfallas,Val.valoracionestado, Val.description]);
        const valoracion_id = evaluando.insertId;
        console.log(valoracion_id);
        const asignada = await pool.query('UPDATE orden set valoracion_id =? WHERE id = ? ', [valoracion_id, VALid])
        req.flash('success', 'Orden Generada Correctamente');
        res.redirect('/Cliente/Panel');
    }
    else {
        console.log('no tiene evaluacion de operador!!!')
        const evaluando = await pool.query('INSERT INTO valoraciones set servicio_id = ? , valoracion = ?, Vpuntualidad = ?, Vexperiencia = ?,Vfallas = ?, Vestadomaquina = ?, description = ?', [servid[0].servicio_id, Val.valoracion ,Val.valoracionpunt,Val.valoracionexp,Val.valoracionfallas,Val.valoracionestado, Val.description]);
        const valoracion_id = evaluando.insertId;
        console.log(valoracion_id);
        const asignada = await pool.query('UPDATE orden set valoracion_id =? WHERE id = ? ', [valoracion_id, VALid])
        req.flash('success', 'Orden Generada Correctamente');
        res.redirect('/Cliente/Panel');
    } 
    
});

router.get('/CrearDatos', (req, res) => {
    res.render('Cliente/CrearDatos');
});

router.post('/CrearDatos', async (req, res) => {
    
    const id = req.user.id; 
    const { fono , correo } = req.body
    //const aers = `INSERT INTO Clientes values(${id},'${fono}','${correo}')`
    await pool.query(`INSERT INTO Clientes values(${id},'${fono}','${correo}')`);
    req.flash('Correcto!', 'Datos Creados Correctamente');
    res.redirect('/Cliente/panel');
    //res.send({fono : fono, correo : correo, aers : aers})
});


module.exports = router;