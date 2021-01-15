var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '首页', content: 'Hello World' });
});

// index 
router.get('/index', (req, res) => {
  res.render('index', { title: '首页', content: 'Hello World' });
});

module.exports = router;
