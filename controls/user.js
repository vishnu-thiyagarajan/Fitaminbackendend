require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const UserModel = mongoose.model('Users')
const router = express.Router()
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../passport');

router.get('/allusers', passport.authenticate('jwt', { session: false }), async (req, res)=>{
  try {
      const users = await UserModel.find({}).populate('role').exec();
      res.send(users);
    } catch (err) {
      res.status(500).send({ message: 'server side error' })
    }
})

router.put('/user', passport.authenticate('jwt', { session: false }), async (req, res)=>{
  try {
      const user = await UserModel.findOneAndUpdate({ email: req.body.email }, { name: req.body.name, role: req.body.role._id}, { new: true})
      res.status(200).send({ message: 'Updated Successfully' });
    } catch (err) {
      res.status(500).send({ message: 'server side error' })
    }
})

router.delete('/user', passport.authenticate('jwt', { session: false }), async (req, res)=>{
  try {
      const user = await UserModel.findByIdAndDelete(req.body._id.trim())
      res.status(200).send({ message: 'Deleted Successfully' });
    } catch (err) {
      res.status(500).send({ message: 'server side error' })
    }
})

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json(req.user);
  }
);

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);
              const body = { _id: user._id, name: user.name, email: user.email, role: user.role };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ ...body, token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

module.exports = router