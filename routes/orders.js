var express = require('express');
const router = express.Router();
const tableName = 'orders';

router.get('/list', (req, res) => {
    dbConn.query(`SELECT * FROM ${tableName}`, (error, results, fields) => {
        if (error) throw error;
        return res.send(results);
    });
});


router.post('/insert', (req, res) => {
    let data = req.body;
    if (!data) {
        return res.status(400).send('Missing parameters');
    }
 
    dbConn.query(`INSERT INTO ${tableName} SET ?`, data, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
});

router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).send('Missing parameters');
    }

    dbConn.query(`DELETE FROM ${tableName} WHERE id = ${id}`, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
}); 

module.exports = router;