const express = require('express')
const mongoose = require('mongoose')
const CoreModel = mongoose.model('Cores')
const router = express.Router()
const passport = require('passport');

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const found = await CoreModel.findOne({ name : req.body.name })
        if (found) return res.status(400).send({ message: 'recipe name already taken' })
        const core = new CoreModel()
        core.name = req.body.name
        core.recipe = req.body.recipe
        core.nutrition = req.body.nutrition
        core.save((err, docs) => {
          if (err) throw err
          res.status(201).send({ ...docs._doc, message : 'core added' })
        })
      } catch (error) {
        return res.status(500).send({ message: 'server side error' })
      }
  })

router.get('/all', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const cores = await CoreModel.find({});
        res.send(cores);
      } catch (err) {
        res.status(500).send({ message: 'server side error' })
      }
  })

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const core = await CoreModel.findOne({ name : req.body.name })
        if (!core) return res.status(400).send({ message: 'No core recipe with that name' })
        core.recipe = req.body.recipe
        core.nutrition = req.body.nutrition
        core.save()
        const resObj = core.toObject()
        return res.status(200).send({ ...resObj, message: 'Updated successfully' })
      } catch (err) {
        return res.status(500).send({ message: 'server side error' })
      }
  })

router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const core = await CoreModel.findByIdAndDelete(req.body._id.trim())
        res.status(200).send({ message: 'Deleted Successfully' });
      } catch (err) {
        res.status(500).send({ message: 'server side error' })
      }
  })

module.exports = router