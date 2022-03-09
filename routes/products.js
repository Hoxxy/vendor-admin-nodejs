var express = require('express');
const router = express.Router();
const tableName = 'products';

router.get('/count', (req, res) => {
    dbConn.query(`SELECT COUNT(*) as count FROM ${tableName}`, (error, results, fields) => {
        if (error) throw error;
        return res.send(results[0]);
    });
});

router.get('/list', (req, res) => {
    dbConn.query(`SELECT * FROM ${tableName}`, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
});

router.get('/find/:product_id', (req, res) => {
    let product_id = req.params.product_id;
    if (!product_id) {
        return res.status(400).send('Missing parameters');
    }
 
    dbConn.query(`SELECT * FROM ${tableName} where product_id=${product_id}`, (error, results) => {
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


router.patch('/update/:product_id', (req, res) => {
 
    let product_id = req.params.product_id;
    let data = req.body;

    if (!product_id || !data) {
        return res.status(400).send('Missing parameters');
    }
 
    dbConn.query(`UPDATE ${tableName} SET ? WHERE product_id = ${product_id}`, data, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
});

router.delete('/delete/:product_id', (req, res) => {
    let product_id = req.params.product_id;
    if (!product_id) {
        return res.status(400).send('Missing parameters');
    }

    dbConn.query(`DELETE FROM ${tableName} WHERE product_id = ${product_id}`, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
}); 

module.exports = router;