const express = require('express');
const app = express();

// Configura el modulo Constructor de los html
app.set('view engine', 'pug');
// Configura el path para los recursos estaticos (js, css, etc)
app.use('/src', express.static(__dirname+'/public'));

app.get('/signup', (req,res) =>{

    /* Utilizamos el renderizador (pug) para generar la respuesta */
    res.render("DE_signup", {title: 'Registrarse'});
});

// US Pedido
app.get('/pedido/:tipo/:formulario?', (req,res, next) =>{
    if(!req.params.formulario && req.params.tipo === "loquesea"){
        res.render("pedido/DE_loquesea", {title: 'Nuevo Pedido'});
    }else if (req.params.formulario === "tarjeta") {
        res.sendFile("pedido/DE_tarjeta.html", {root: __dirname+"/views/"});
    }
    else{
        res.redirect('/signup');
    }
});

// Definicion del root
app.get('/', (req, res) =>{
    res.redirect('/signup');
});

// Inicio del servidor
const server = app.listen(8585, () => {
    /* Codigo del servidor */
    console.log(`Express corriendo! -> PORT: ${server.address().port}`)
});
