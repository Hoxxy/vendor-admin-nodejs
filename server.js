var app = require('express')();
var bodyParser = require('body-parser');
var mysql = require('mysql');

dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vendor'
});
dbConn.connect(); 


const port = 1313;
 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var users = require('./routes/users');
var reviews = require('./routes/reviews');
var products = require('./routes/products');
var categories = require('./routes/categories');
var orders = require('./routes/orders');
var orderProducts = require('./routes/order_products');
app.use("/vendor/user", users);
app.use("/vendor/review", reviews);
app.use("/vendor/product", products);
app.use("/vendor/category", categories);
app.use("/vendor/order", orders);
app.use("/vendor/order_product", orderProducts);


app.listen(port, () => {
    console.log(`Node app is running on port ${port}`);
});
module.exports = app;