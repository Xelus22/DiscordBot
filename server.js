//import express package
const express = require('express');

//create new server
const server = express();

//send bot is alive
server.all('/', (req, res)=>{
    res.send('Xelbot is alive!')
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive;
