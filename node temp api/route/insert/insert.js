const express = require('express');
const sql = require('mysql2');

const app = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const conn = sql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cultural-finder-db'
});

function insertCitta(citta) {
    conn.query("SELECT id FROM luogo WHERE luogo.nome = ?", [citta.nome], (err, result) => {
        if(err) {
            throw new Error(err);
        }
        if(result.length > 0) {
        }
        else {
            conn.query("INSERT INTO luogo(nome, latitudine, longitudine) VALUES(?, ?, ?)", [citta.nome, citta.latitude, citta.longitude], (err, result) => {
                if(err) {
                    throw new Error(err);
                }
            })
        }
    });
}

app.post('/citta', function(req, res) {

    const nome = req.body.nome;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const monumenti = req.body.monumenti;

    insertCitta({nome, latitude, longitude})

    return res.sendStatus(200);
})

app.post('/sede', (req, res) => {
    const nome = req.body.nome;
    const latitude = req.body.coordinate[0];
    const longitude = req.body.coordinate[1];
    const luogo = req.body.luogo;

    conn.query("SELECT id FROM luogo WHERE luogo.nome = ?", [luogo], (err, result) => {
        if(err || !result[0]) {
            return res.sendStatus(401);
        }
        conn.query("INSERT INTO sede(nome, latitudine, longitudine, luogo_id) VALUES(?, ?, ?, ?)", [nome, latitude, longitude, result[0].id], (err, result1) => {
            if(err) {
                return res.sendStatus(401);
            }
            return res.sendStatus(201);
        })
    })
})

app.post('/opera', function(req, res) {

    const nome = req.body.Nome;
    const dimensioni = req.body.Dimensioni;
    const data = req.body.Data;
    const autore = req.body.Autore;
    const sede = req.body.Ubicazione;

    conn.query("SELECT sede.id as sede_id, sede.luogo_id as luogo_id, autore.id as autore_id FROM sede INNER JOIN autore WHERE sede.nome = ? AND autore.nome = ?", [sede, autore], (err, result) => {
        if(err) {
            return res.sendStatus(401);
        }
        const sede_id = result[0].sede_id;
        const luogo_id = result[0].luogo_id;
        const autore_id = result[0].autore_id;
        conn.query("INSERT INTO opera_d_arte(nome, dimensioni, anno_pubblicazione, autore_id, luogo_id, sede_id) VALUES(?, ?, ?, ?, ?, ?)", [nome, dimensioni, data, autore_id, luogo_id, sede_id], (err, result) => {
            if(err) {
                return res.sendStatus(401);
            }
            return res.sendStatus(201);
        })

    })
})

app.post('/autore', (req, res) => {
    const nome = req.body.nome;
    const data = req.body.anno_nascita;

    conn.query("INSERT INTO autore(nome, anno_nascita) VALUES(?, ?)", [nome, data], (err, result) => {
        if(err) {
            return res.sendStatus(401);
        }
        return res.sendStatus(201);
    })
})

app.post("/corrente", (req, res) => {
    const nome = req.body.nome;
    conn.query("INSERT INTO corrente(nome) VALUE(?)", [nome], (err, result) => {
        if(err) {
            return res.sendStatus(401);
        }
        return res.sendStatus(201);
    })
})

app.post("/corrente_autore", (req, res) => {
    const autore = req.body.autore;
    const corrente = req.body.corrente;

    conn.query("SELECT autore.id AS autore_id, corrente.id AS corrente_id FROM autore INNER JOIN corrente WHERE autore.nome = ? AND corrente.nome = ?", [autore, corrente], (err, res) => {
        if(err) {
            return res.sendStatus(401);
        }
        
        const autore_id = res[0].autore_id;
        const corrente_id = res[0].corrente_id;
        conn.query("INSERT INTO corrente_autore(autore_id, corrente_id) VALUES(?, ?)", [autore_id, corrente_id], (err, result) => {
            if(err) {
                return res.sendStatus(401);
            }
            return res.sendStatus(201);
        })
    })
})

module.exports = app;