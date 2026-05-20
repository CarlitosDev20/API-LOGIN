require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// POOL MYSQL AWS
const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

console.log('Servidor iniciado');

// LOGIN
app.post('/login', (req, res) => {

    const correo = req.body.correo;
    const contrasena = req.body.contrasena;

    const sql = `
    SELECT * FROM Usuario
    WHERE correo = ?
    `;

    conexion.query(sql, [correo], (error, resultado) => {

        if (error) {

            console.log(error);

            return res.status(500).json({
                mensaje: 'Error MySQL',
                error: error.message,
                code: error.code
            });

        }

        if (resultado.length === 0) {

            return res.json({
                mensaje: 'Usuario no existe'
            });

        }

        const usuario = resultado[0];

        if (contrasena === usuario.contrasena) {

            res.json({
                mensaje: 'Login correcto'
            });

        } else {

            res.json({
                mensaje: 'Contraseña incorrecta'
            });

        }

    });

});

// CAMBIAR PASSWORD
app.put('/cambiar-password', (req, res) => {

    const correo = req.body.correo;
    const nueva = req.body.nueva;

    const sql = `
    UPDATE Usuario
    SET contrasena = ?
    WHERE correo = ?
    `;

    conexion.query(sql, [nueva, correo], (error) => {

        if (error) {

            console.log(error);

            return res.status(500).json({
                mensaje: 'Error MySQL',
                error: error.message,
                code: error.code
            });

        }

        res.json({
            mensaje: 'Contraseña actualizada'
        });

    });

});

// PUERTO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor corriendo en puerto ${PORT}`);

});
