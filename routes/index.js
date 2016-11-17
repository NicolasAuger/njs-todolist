const router = require('express').Router()

/* Page d'accueil */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'TP Njs-TodoList - NodeJs / NoSQL' })
})

module.exports = router
