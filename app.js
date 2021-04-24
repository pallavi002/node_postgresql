const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv');

const { Client } = require('pg');
const connectionString = 'postgres://postgres:noob@127.0.0.1:5432/HOTEL';
const client = new Client({
    connectionString: connectionString
});

client.connect((err,res)=>{
    if(err) {
        console.log("You messed up something "+err);
    } else {
        console.log("Database successfully connected!!");
    }
});
// const createuser = async function() {
//     const query = `
//     CREATE TABLE ITEMS (
//         itemno SERIAL PRIMARY KEY,
//         item_name varchar(20) not null,
//         price integer not null,
//         quantity varchar(50)
//     );
//     `;
//     try {
//         const res = await client.query(query);
//         console.log('Table ITEM is successfully created');
//     } catch (err) {
//         console.log(err.stack);
//     } finally {
//         client.close();
//     }
// }
// createuser();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.post('/addcustomer', async (req, res) => {
    var user = req.body.cname;
    var address = req.body.caddress;
    var contact = req.body.ccontact;
    // console.log(user + address + contact)
    const query = `
    INSERT INTO customers (name, contact, address)
    VALUES ('${user}', ${contact}, '${address}')
    `;    
    try {
        const res = await client.query(query);
        console.log('User is successfully added');
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
    res.redirect('back');
})

app.get('/viewcustomers', async (req, res) => {
    const query = `
    SELECT * FROM CUSTOMERS;
    `;
    try {
        const customers = await client.query(query);
        res.render('showcustomers', {
            customers: customers.rows
        })
        // console.log(res.rows);
    } catch(err) {
        console.log(err);
    }
})

app.get('/additem', function(req, res) {
    res.render('additem.ejs');
})

app.post('/additem', async (req, res) => {
    var itemname = req.body.itemname;
    var quantity = req.body.quantity;
    var price = req.body.price;
    // console.log(user + address + contact)
    const query = `
    INSERT INTO items (item_name, quantity, price)
    VALUES ('${itemname}', '${quantity}', '${price}')
    `;    
    try {
        const res = await client.query(query);
        console.log('ITEM is successfully added');
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
    res.redirect('back');
})

app.get('/menu', async (req, res) => {
    const query = `
    SELECT * FROM ITEMS;
    `;
    try {
        const items = await client.query(query);
        res.render('menu', {
            items: items.rows
        })
        // console.log(res.rows);
    } catch(err) {
        console.log(err);
    }
})

app.listen('6005', function () {
    console.log("Server running on port 6005..!!");
})