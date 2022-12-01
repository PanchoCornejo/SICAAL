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