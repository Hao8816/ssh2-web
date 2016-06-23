var express = require('express');
var router = express.Router();
var command = require('../core/test_shell');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ssh2-web' });
});

router.post('/exec_command/',function(req,res){
  command.execCommands(req,res);
});

module.exports = router;
