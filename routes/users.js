var express = require('express')
var router = express.Router()

router.post('/request', function (req, res, next) {
  if (!req.body.from || !req.body.to || !req.body.contract || !req.body.doc || (!req.body.payment && req.body.payment!=0)) {
    return res.status(400).send('Not enough parameter')
  } else {
    const splitPassage = req.body.doc.split('/\r?\n/')
    const snippet = req.body.doc.substr(0, 150)
    const job = {
      'Fromlanguage': req.body.from,
      'Tolanguage': req.body.to,
      'Payment': req.body.payment,
      'ContractAddress': req.body.contract,
      'Snippet': snippet,
      'AllTranslated': false,
      'Reviewed': false
    }
    // insert passage
    return knex('Passage').insert(job).returning('ID')
    .then(id => {
      // parse and insert paragraphs
      let paragraphs = [];
      for (let i = 0; i < splitPassage.length; i++) {
        paragraphs.push({
          'PassageID': id[0],
          'ParagraphIndex': i,
          'OriginalText': String(splitPassage[i]),
          'Assigned': false,
          'Translated': false
        })
      }
      return knex('Paragraph').insert(p)
      .next(rows => {
        res.send({ received: true })
      })
    })
  }
})

router.get('/receive', function (req, res, next) {
  if (!req.body.passage || (!req.body.ID && req.body.ID!=0)) {
    return res.status(400).send('Not enough parameter')
  } else {
    // query translated text to user with passageID
    knex('Passage').select('TranslatedText').where('ID',req.body.ID)
    .then(rows => {
      res.send(rows[0])
    })
  }
  /*
  let result = {
    finished: false
  }
  res.send(result)
  */
})

module.exports = router
