const express = require('express');
const path = require('path');

const router = express.Router()

module.exports = function (moduleManager) {
    router.get('/', function(req, res){
        res.sendFile(__dirname + '../public/index/index.html');
    });
    
    router.get('/eval', function(req, res){
        res.sendFile(__dirname + '../public/eval/eval.html');
    });
    
    router.post('/restartgame', function(req,res){
        moduleManager.restart();
    });
    
    router.post('/startgame', function(req,res){
        console.log('/startgame');
        moduleManager.start(req.body.game);
    });
    
    router.post('/evalpost', (req, res) => {
        console.log('Eval: ' + req.body.eval);
        eval(req.body.eval);
        res.redirect('/eval');
    });
    
    router.post('/startgamepost', (req, res) => {
        console.log('startgamepost: ' + req.body.game);
        if (req.body.game != -1) {
            moduleManager.start(req.body.game);
        }
    });
      
    router.get("*", (req, res) => res.status(404).send("404"));

    return router;
}