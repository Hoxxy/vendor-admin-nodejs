var express = require('express');
const router = express.Router();
const tableName = 'users';

router.get('/list', (req, res) => {
    dbConn.query(`SELECT * FROM ${tableName}`, (error, results, fields) => {
        if (error) throw error;
        return res.send(results);
    });
});

router.get('/find/:id', (req, res) => {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send('Missing parameters');
    }
 
    dbConn.query(`SELECT * FROM ${tableName} where id=${user_id}`, (error, results) => {
        if (error) throw error;
        return res.send(results[0]);
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


router.patch('/update/:id', (req, res) => {
 
    let user_id = req.params.id;
    let data = req.body;

    if (!user_id || !data) {
        return res.status(400).send('Missing parameters');
    }
 
    dbConn.query(`UPDATE ${tableName} SET ? WHERE id = ${user_id}`, data, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
});

router.delete('/delete/:id', (req, res) => {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send('Missing parameters');
    }

    dbConn.query(`DELETE FROM ${tableName} WHERE id = ${user_id}`, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
}); 

module.exports = router;