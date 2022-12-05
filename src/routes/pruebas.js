router.post('/misordenes', isClient, async (req, res) => {
    const { ORDID } = req.body;
    console.log("Hola estamos en POST de misordenes ")
    console.log(req.body);
    const Opcion = {
        ORDID
    };
    console.log(Opcion.ORDID);
    res.redirect('Cliente/Evaluar', {Opcion});
});


    // Rellenar las ciudades con 0
    const CNmetropolitana = {};
    for (let i = 0; i < metropolitana.length; i++) {
        if (metropolitana[i].id_city == Nmetropolitana[i].id_city){
            // es por que no es 0 y tiene un servicio alli
            
        }else{
            // es por que no tiene servicio alli y hay que colocarle un 0

        }
      }












    //Total de "Servicios Disponibles" en cada region
    const Sarica = await pool.query('SELECT * FROM proveedores WHERE id_region="1"');
    const Starapaca = await pool.query('SELECT id_city, name FROM cities WHERE id_region="2"');
    const Santofagasta = await pool.query('SELECT id_city, name FROM cities WHERE id_region="3"');
    const Satacama = await pool.query('SELECT id_city, name FROM cities WHERE id_region="4"');
    const Scoquimbo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="5"');
    const Svalparaiso = await pool.query('SELECT id_city, name FROM cities WHERE id_region="6"');
    const Smetropolitana = await pool.query('SELECT id_city, name FROM cities WHERE id_region="7"');
    const Sbernardo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="8"');
    const Smaule = await pool.query('SELECT id_city, name FROM cities WHERE id_region="9"');
    const Sñuble = await pool.query('SELECT id_city, name FROM cities WHERE id_region="10"');
    const Sbiobio = await pool.query('SELECT id_city, name FROM cities WHERE id_region="11"');
    const Saraucania = await pool.query('SELECT id_city, name FROM cities WHERE id_region="12"');
    const Srios = await pool.query('SELECT id_city, name FROM cities WHERE id_region="13"');
    const Slagos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="14"');
    const Scarlos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="15"');
    const Santartica = await pool.query('SELECT id_city, name FROM cities WHERE id_region="16"');
    //Promedio de "Valoracion General" en cada region
    const Varica = await pool.query('SELECT * FROM proveedores WHERE id_region="1"');
    const Vtarapaca = await pool.query('SELECT id_city, name FROM cities WHERE id_region="2"');
    const Vantofagasta = await pool.query('SELECT id_city, name FROM cities WHERE id_region="3"');
    const Vatacama = await pool.query('SELECT id_city, name FROM cities WHERE id_region="4"');
    const Vcoquimbo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="5"');
    const Vvalparaiso = await pool.query('SELECT id_city, name FROM cities WHERE id_region="6"');
    const Vmetropolitana = await pool.query('SELECT id_city, name FROM cities WHERE id_region="7"');
    const Vbernardo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="8"');
    const Vmaule = await pool.query('SELECT id_city, name FROM cities WHERE id_region="9"');
    const Vñuble = await pool.query('SELECT id_city, name FROM cities WHERE id_region="10"');
    const Vbiobio = await pool.query('SELECT id_city, name FROM cities WHERE id_region="11"');
    const Varaucania = await pool.query('SELECT id_city, name FROM cities WHERE id_region="12"');
    const Vrios = await pool.query('SELECT id_city, name FROM cities WHERE id_region="13"');
    const Vlagos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="14"');
    const Vcarlos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="15"');
    const Vantartica = await pool.query('SELECT id_city, name FROM cities WHERE id_region="16"');
    //Cantidad total de "Proveedores" en cada region
    const Carica = await pool.query('SELECT * FROM proveedores WHERE id_region="1"');
    const Ctarapaca = await pool.query('SELECT id_city, name FROM cities WHERE id_region="2"');
    const Cantofagasta = await pool.query('SELECT id_city, name FROM cities WHERE id_region="3"');
    const Catacama = await pool.query('SELECT id_city, name FROM cities WHERE id_region="4"');
    const Ccoquimbo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="5"');
    const Cvalparaiso = await pool.query('SELECT id_city, name FROM cities WHERE id_region="6"');
    const Cmetropolitana = await pool.query('SELECT id_city, name FROM cities WHERE id_region="7"');
    const Cbernardo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="8"');
    const Cmaule = await pool.query('SELECT id_city, name FROM cities WHERE id_region="9"');
    const Cñuble = await pool.query('SELECT id_city, name FROM cities WHERE id_region="10"');
    const Cbiobio = await pool.query('SELECT id_city, name FROM cities WHERE id_region="11"');
    const Caraucania = await pool.query('SELECT id_city, name FROM cities WHERE id_region="12"');
    const Crios = await pool.query('SELECT id_city, name FROM cities WHERE id_region="13"');
    const Clagos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="14"');
    const Ccarlos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="15"');
    const Cantartica = await pool.query('SELECT id_city, name FROM cities WHERE id_region="16"');
    //Cantidad de "Servicios Activos" en cada region
    const Aarica = await pool.query('SELECT * FROM proveedores WHERE id_region="1"');
    const Atarapaca = await pool.query('SELECT id_city, name FROM cities WHERE id_region="2"');
    const Aantofagasta = await pool.query('SELECT id_city, name FROM cities WHERE id_region="3"');
    const Aatacama = await pool.query('SELECT id_city, name FROM cities WHERE id_region="4"');
    const Acoquimbo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="5"');
    const Avalparaiso = await pool.query('SELECT id_city, name FROM cities WHERE id_region="6"');
    const Ametropolitana = await pool.query('SELECT id_city, name FROM cities WHERE id_region="7"');
    const Abernardo = await pool.query('SELECT id_city, name FROM cities WHERE id_region="8"');
    const Amaule = await pool.query('SELECT id_city, name FROM cities WHERE id_region="9"');
    const Añuble = await pool.query('SELECT id_city, name FROM cities WHERE id_region="10"');
    const Abiobio = await pool.query('SELECT id_city, name FROM cities WHERE id_region="11"');
    const Aaraucania = await pool.query('SELECT id_city, name FROM cities WHERE id_region="12"');
    const Arios = await pool.query('SELECT id_city, name FROM cities WHERE id_region="13"');
    const Alagos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="14"');
    const Acarlos = await pool.query('SELECT id_city, name FROM cities WHERE id_region="15"');
    const Aantartica = await pool.query('SELECT id_city, name FROM cities WHERE id_region="16"');
