require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserModel = mongoose.model('Users')
const router = express.Router()
const passport = require('passport');
const init = require('../passport');

async function getUserByEmail(email){
  try {
    const user = await UserModel.findOne({ email: email }).populate('role').exec()
    return user
  } catch (error) {
    return null
  }
}

async function getUserById(id){
  try {
      const user = await UserModel.findOne({ _id: id }).populate('role').exec()
      return user
  } catch (error) {
    return null
  }
}

init(passport, 
  getUserByEmail,
  getUserById
  )
router.use(passport.initialize())
router.use(passport.session())
router.post('/login', function(req, res, next) {
  passport.authenticate('local',function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.status(400).send({ message: info.message })
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(201).send(req.user);
    });
  })(req, res, next)
})

router.post('/register', async (req, res)=>{
  console.log(req.body)
  try {
      const hassedPswd = await bcrypt.hash(req.body.password, 10)
      const user = new UserModel()
      user.email = req.body.email
      user.name = req.body.name
      user.password = hassedPswd
      user.role = req.body.role._id
      user.createdAt = new Date().toISOString()
      if (await getUserByEmail(req.body.email)) {
        return res.status(403).send({ message: 'User with emailid already exists' })
      }
      user.save((err, docs) => {
        if (err) throw err
        const resObj = docs.toObject()
        resObj.role = req.body.role
        console.log(resObj)
        res.status(201).send(resObj)
      })
    } catch (err) {
      res.status(500).send({ message: 'server side error' })
    }
})

// function auth(req, res, next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('/login')
// }

// function notAuth(req, res, next) {
//     if (req.isAuthenticated()) {
//       return res.redirect('/')
//     }
//     next()
// }

module.exports = router