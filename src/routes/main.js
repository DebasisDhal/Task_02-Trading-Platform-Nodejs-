const express = require('express');
const connection = require('../models/database');

//const { route }

const routes = express.Router()

routes.get("/", (req,res) => {
    let sql = "SELECT * FROM crypto_data;";
    connection.query(sql,function(err,results){
        if(err) throw err;
        res.send(results);
    });
    res.render("index")
});

routes.get("/greet",(req,res) => {
    res.render("greet")
})

module.exports = routes