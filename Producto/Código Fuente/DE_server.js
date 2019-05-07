const express = require('express');
const app = express();

// Configura el modulo Constructor de los html
app.set('view engine', 'pug');
// Configura el path para los recursos estaticos (js, css, etc)
app.use(express.static(__dirname+'/public'));

app.get('/signup', (req,res) =>{

    /* Utilizamos el renderizador (pug) para generar la respuesta */
    res.render("DE_signup", {title: 'Registrarse'});
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
