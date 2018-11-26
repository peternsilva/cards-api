const express = require('express')
const router = express.Router()
const fs = require('fs')
const dbfile = 'db/db.json'

function getRecords() {
  return JSON.parse(fs.readFileSync(dbfile, 'utf8'))
}

function setRecords(records) {
  fs.writeFileSync(dbfile, JSON.stringify(records), 'utf8')
}

router.get('/', (req, res, next) => {
  try {
    res.json(getRecords())
  } catch(err) {
    next(err)
  }
})

router.get('/:id', (req, res, next) => {
  try {
      let foundRec = getRecords().find((record) => { return (record.id == req.params.id) })
      if (!foundRec) throw new Error(`Couldn't find record with that ID`)
      res.json(foundRec)
  } catch(err) {
    next(err)
  }
})

router.post('/', (req, res, next) => {
  try {
    if (req.body.hasOwnProperty('title') || !req.body.title) {
        records = getRecords()
        let newRec = {
          id: records[records.length-1].id+1,
          title: req.body.title,
          created_at: "2018-11-21T07:55:28.741Z",
          updated_at: "2018-11-21T07:55:28.741Z"
        }
        records.push(newRec)
        setRecords(records)
        res.status(201).json(newRec)
    } else {
      throw new Error(`Needs a value for key "title"`)
    }
  } catch(err) {
    next(err)
  }
})

module.exports = router
