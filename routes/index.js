var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Chat Channels | App',
    user: req.user
  });
});

router.get('/signup', function(req, res) {
  res.render('signup', {
    user: req.user
  });
});

router.get('/channels', function(req, res) {
  res.render('channels', {
    user: req.user
  });
});

router.get('/chat', function(req, res) {
  res.render('chat', {
    user: req.user
  });
});

module.exports = router;
