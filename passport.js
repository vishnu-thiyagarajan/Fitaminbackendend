const localStrategy = require('passport-local').Strategy;
require('dotenv').config()
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const UserModel = require('./models/user.model');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD
  }
});

var mailOptions = {
  from: process.env.EMAIL_ID,
  subject: 'Account activation link',
};

passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const userfound = await UserModel.findOne({ email })
          if (userfound) return done('User already registered')
          const token = jwt.sign({ user: {name: req.body.name, email, role: req.body.role._id} }, process.env.JWT_ACC_ACTIVATE);
          mailOptions.html = `<h2>Please click the link below to activate</h2><br/>
          <a href='${process.env.CLIENT_URL}/auth/activate/${token}'>${process.env.CLIENT_URL}/auth/activate/${token}</a>`
          mailOptions.to = email
          const info = await transporter.sendMail(mailOptions)
          if (!info.messageId) return done('We could not send account activation mail as of now.')
          const user = await UserModel.create({ name: req.body.name, email, password, role: req.body.role._id });
          const resObj = user.toObject();
          resObj.role = req.body.role
          resObj.token = token
          return done(null, resObj);
        } catch (error) {
          done(error);
        }
      }
    )
  );

// ...

passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email }).populate('role').exec();
  
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          const validate = await user.isValidPassword(password );
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }

          if (!user.active) {
            return done(null, false, { message: 'Please activate your account' });
          }

          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.JWT_ACC_ACTIVATE,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

// function init(passport, getUserByEmail, getUserById){
//     const authenticateUser = async (email, password, done) => {
//         const user = await getUserByEmail(email);
//         if (user == null){
//             return done(null, false, {message: 'No user with that email exists'})
//         }
//         try{
//             const validate = await user.isValidPassword(password);
//             if (validate){
//                 return done(null, user)
//             } else {
//                 return done(null, false, {message: 'Password Incorrect'})
//             }
//         } catch(e) {
//             return done(e);
//         }
//     }
//     passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser(async (id, done) => {
//         return done(null, await getUserById(id))
//     })
// }

// module.exports = init