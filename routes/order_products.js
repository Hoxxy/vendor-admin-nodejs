var express = require('express');
const router = express.Router();
const tableName = 'orders_products';

router.get('/listByOrder/:order_id', (req, res) => {
    let order_id = req.params.order_id;
    dbConn.query(`SELECT * FROM ${tableName} WHERE order_id = ${order_id}`, (error, results, fields) => {
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

router.delete('/delete/:order_id/:product_id', (req, res) => {
    let order_id = req.params.order_id;
    let product_id = req.params.product_id;
    if (!order_id || !product_id) {
        return res.status(400).send('Missing parameters');
    }

    dbConn.query(`DELETE FROM ${tableName} WHERE order_id = ${order_id} AND product_id = ${product_id}`, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
}); 

router.delete('/deleteByOrder/:order_id', (req, res) => {
    let order_id = req.params.order_id;
    if (!order_id) {
        return res.status(400).send('Missing parameters');
    }

    dbConn.query(`DELETE FROM ${tableName} WHERE order_id = ${order_id}`, (error, results) => {
        if (error) throw error;
        return res.send(results);
    });
}); 

module.exports = router;