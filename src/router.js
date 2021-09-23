const express = require('express');
const path = require('path');

const router = express.Router()

module.exports = function (moduleManager) {

    router.get('/', function(req, res){
        res.sendFile(__dirname + '../public/index/index.html');
    });
    
    router.route('/eval')
    .get(function(req, res){
        res.sendFile(__dirname + '../public/eval/eval.html');
    })
    .post(function(req, res){
        eval(req.body.eval);
        res.redirect('/eval');
    });

    router.post('/restart', function(req,res){
        moduleManager.restart();
    });
    
    router.post('/start', function(req,res){
        moduleManager.start(req.body.module);
    });
      
    router.get("*", (req, res) => res.status(404).send("404"));

    return router;
}