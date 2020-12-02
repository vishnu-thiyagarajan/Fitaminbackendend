const express = require('express')
const mongoose = require('mongoose')
const CustomizeModel = mongoose.model('Customizes')
const router = express.Router()
const passport = require('passport');

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const corerecipe = req.body.corerecipe
        const wantsto = req.body.wantsto
        const weight = req.body.weight
        const obj = await CustomizeModel.find({ corerecipe, wantsto, weight });
        if (obj._id) {
            return res.status(400).send({ message: 'recipe customized already' })
        }
        const custom = new CustomizeModel()
        custom.corerecipe = corerecipe
        custom.wantsto = wantsto
        custom.weight = weight
        custom.recipe = req.body.recipe
        custom.nutrition = req.body.nutrition
        custom.save((err, docs) => {
          if (err) throw err
          res.status(201).send({ ...docs._doc, message : 'customized dish added' })
        })
      } catch (error) {
        return res.status(500).send({ message: 'server side error' })
      }
  })

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const corerecipe = req.query.corerecipe
        const wantsto = req.query.wantsto
        const weight = req.query.weight
        const customdish = await CustomizeModel.findOne({corerecipe, wantsto, weight});
        if (!customdish) return res.status(400).send({ message: 'no dish with that type, weight, name'});
        return res.status(200).send(customdish);
      } catch (err) {
        res.status(500).send({ message: 'server side error' })
      }
  })

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const corerecipe = req.body.corerecipe
        const wantsto = req.body.wantsto
        const weight = req.body.weight
        const custom = await CustomizeModel.findOne({ corerecipe, wantsto, weight })
        if (!custom) return res.status(400).send({ message: 'No custom recipe with that weight and type and corerecipe' })
        custom.recipe = req.body.recipe
        custom.nutrition = req.body.nutrition
        custom.save()
        const resObj = custom.toObject()
        return res.status(200).send({ ...resObj, message: 'Updated successfully' })
      } catch (err) {
        return res.status(500).send({ message: 'server side error' })
      }
  })

router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res)=>{
    try {
        const custom = await CustomizeModel.findByIdAndDelete(req.body._id.trim())
        return res.status(200).send({ message: 'Deleted Successfully' });
      } catch (err) {
        res.status(500).send({ message: 'server side error' })
      }
  })

module.exports = router