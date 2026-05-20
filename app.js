const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'db_cesal'
});

conexion.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log('conectado a mysql');
}
    })

//LOGIN
app.post('/login',(req,res)=>{
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;

    const sql = `
    SELECT * FROM Usuario
    WHERE correo = ?
    `;
conexion.query(sql,[correo],(error,resultado)=>{
    if(error){
        console.log(error);

return res.status(500).json({
    mensaje: 'Error MySQL',
    error: error.message,
    code: error.code
});
    }

    if(resultado.length === 0){
        return res.json({
            mensaje:'Usuario no existe'
        });
    }
     const usuario = resultado[0];

        if(contrasena === usuario.contrasena){

            res.json({
                mensaje:'Login correcto'
            });

        }

        else{

            res.json({
                mensaje:'Contraseña incorrecta'
            });

        }

    });

});


// CAMBIAR PASSWORD
app.put('/cambiar-password',(req,res)=>{

    const correo = req.body.correo;
    const nueva = req.body.nueva;

    const sql = `
    UPDATE Usuario
    SET contrasena = ?
    WHERE correo = ?
    `;

    conexion.query(sql,[nueva,correo],(error,resultado)=>{

        if(error){
            console.log(error);

return res.status(500).json({
    mensaje: 'Error MySQL',
    error: error.message,
    code: error.code
});
        }

        res.json({
            mensaje:'Contraseña actualizada'
        });

    });

});


app.listen(3000,()=>{

    console.log('Servidor corriendo');

});
